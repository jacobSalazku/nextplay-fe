import { PlayEditor } from '../play-editor';
import { seedDiagram } from '../seed-diagram';
import type { PlacedObject } from '@/features/playbook/diagram/types';
import { usePlayEditorStore } from '@/store/use-play-editor-store';
import { api, gqlData } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
  useParams: () => ({ routeKey: 'team~1' }),
}));

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 25, y: 25 },
];

function pinBox() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    right: 200,
    bottom: 200,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
}

function renderEditor() {
  return renderWithClient(
    <PlayEditor
      playId="play-1"
      routeKey="team~1"
      name="Horns"
      diagram={seedDiagram('half', objects)}
    />,
  );
}

beforeEach(() => usePlayEditorStore.getState().reset());
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('PlayEditor', () => {
  it('shows the play name and a disabled Save until something changes', () => {
    // Act
    renderEditor();

    // Assert
    expect(screen.getByRole('heading', { name: 'Horns' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('saves the dragged diagram and disables Save again', async () => {
    // Arrange
    pinBox();
    const user = userEvent.setup();
    const seen = vi.fn();
    server.use(
      api.mutation('UpdatePlay', ({ variables }) => {
        seen(variables.input);
        return gqlData({ updatePlay: { id: 'play-1' } });
      }),
    );
    renderEditor();

    // Act — drag the token, then save
    const handle = screen.getByRole('button', { name: 'Move 1' });
    await user.pointer([
      { target: handle, keys: '[MouseLeft>]', coords: { x: 50, y: 50 } },
      { target: handle, coords: { x: 100, y: 100 } },
      { keys: '[/MouseLeft]' },
    ]);
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    await waitFor(() =>
      expect(seen).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'play-1',
          routeKey: 'team~1',
          diagram: expect.objectContaining({ version: 1, court: 'half' }),
        }),
      ),
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('leaves without confirming when there are no unsaved changes', async () => {
    // Arrange
    const user = userEvent.setup();
    renderEditor();

    // Act
    await user.click(screen.getByRole('button', { name: /back to playbook/i }));

    // Assert
    expect(push).toHaveBeenCalledWith('/team/team~1/playbook');
  });

  it('asks before leaving with unsaved changes', async () => {
    // Arrange
    pinBox();
    const user = userEvent.setup();
    renderEditor();
    const handle = screen.getByRole('button', { name: 'Move 1' });
    await user.pointer([
      { target: handle, keys: '[MouseLeft>]', coords: { x: 10, y: 10 } },
      { target: handle, coords: { x: 90, y: 90 } },
      { keys: '[/MouseLeft]' },
    ]);

    // Act
    await user.click(screen.getByRole('button', { name: /back to playbook/i }));

    // Assert — a confirm dialog, and no navigation yet
    expect(
      await screen.findByRole('alertdialog', { name: /leave without saving/i }),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();

    // Act — confirm
    await user.click(screen.getByRole('button', { name: 'Leave' }));

    // Assert
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith('/team/team~1/playbook'),
    );
  });
});
