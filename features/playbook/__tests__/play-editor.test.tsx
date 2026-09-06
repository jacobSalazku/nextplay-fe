import { StrictMode } from 'react';
import { PlayEditor } from '../components/editor/play-editor';
import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import { seedDiagram } from '@/features/playbook/utils/editor/seed-diagram';
import { usePlayEditorStore } from '@/store/use-play-editor-store';
import { api, gqlData, gqlError } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithClient } from '@/test/utils';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
  useParams: () => ({ routeKey: 'team~1' }),
}));

const objects: PlacedObject[] = [
  { id: 'o1', kind: 'offense', label: '1', x: 25, y: 25 },
  { id: 'o2', kind: 'offense', label: '2', x: 75, y: 75 },
  { id: 'x1', kind: 'defense', label: 'x2', x: 50, y: 50 },
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
  it('keeps the diagram loaded through a StrictMode remount', () => {
    // Act — StrictMode double-invokes mount effects
    renderWithClient(
      <StrictMode>
        <PlayEditor
          playId="play-1"
          routeKey="team~1"
          name="Horns"
          diagram={seedDiagram('half', objects)}
        />
      </StrictMode>,
    );

    // Assert — the token is still on the court, not reset away
    expect(
      screen.getByRole('button', { name: 'Move player 1' }),
    ).toBeInTheDocument();
  });

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
    const handle = screen.getByRole('button', { name: 'Move player 1' });
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

  it('keeps the play dirty and Save enabled when the save fails', async () => {
    // Arrange
    pinBox();
    const user = userEvent.setup();
    server.use(api.mutation('UpdatePlay', () => gqlError('Server exploded')));
    renderEditor();

    // Act — drag, then a save that fails
    const handle = screen.getByRole('button', { name: 'Move player 1' });
    await user.pointer([
      { target: handle, keys: '[MouseLeft>]', coords: { x: 50, y: 50 } },
      { target: handle, coords: { x: 100, y: 100 } },
      { keys: '[/MouseLeft]' },
    ]);
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assert — the coach can still retry
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /save/i })).toBeEnabled(),
    );
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
    const handle = screen.getByRole('button', { name: 'Move player 1' });
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

describe('PlayEditor — selection', () => {
  const store = () => usePlayEditorStore.getState();

  it('deletes the selected route with the Delete key', async () => {
    // Arrange
    const user = userEvent.setup();
    renderEditor();
    act(() => {
      store().addAction({ type: 'pass', fromId: 'o1', toId: 'o2' });
    });
    const { id } = store().phases[store().activePhaseIndex].actions[0];

    // Act
    await user.keyboard('{Delete}');

    // Assert
    expect(store().phases[store().activePhaseIndex].actions).toHaveLength(0);
    expect(store().selection).toBeNull();
    expect(id).toBeDefined();
  });

  it('marks the roster chip for the selected player', () => {
    // Arrange
    renderEditor();

    // Act
    act(() => store().select({ kind: 'object', id: 'x1' }));

    // Assert
    expect(
      screen.getByRole('button', { name: 'Opponent 1, on court' }),
    ).toHaveClass('ring-2');
  });
});

describe('PlayEditor — rename', () => {
  it('renames the play from the header title', async () => {
    // Arrange
    const user = userEvent.setup();
    const seen = vi.fn();
    server.use(
      api.mutation('UpdatePlay', ({ variables }) => {
        seen(variables.input);
        return gqlData({ updatePlay: { id: 'play-1' } });
      }),
    );
    renderEditor();

    // Act — click the title, type a new name, commit with Enter
    await user.click(screen.getByRole('button', { name: 'Horns' }));
    const field = screen.getByLabelText('Play name');
    await user.clear(field);
    await user.type(field, 'Horns flare{Enter}');

    // Assert
    await waitFor(() =>
      expect(seen).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'play-1', name: 'Horns flare' }),
      ),
    );
  });

  it('does not call the backend when the name is unchanged', async () => {
    // Arrange
    const user = userEvent.setup();
    const seen = vi.fn();
    server.use(
      api.mutation('UpdatePlay', ({ variables }) => {
        seen(variables.input);
        return gqlData({ updatePlay: { id: 'play-1' } });
      }),
    );
    renderEditor();

    // Act — open and close the field without editing
    await user.click(screen.getByRole('button', { name: 'Horns' }));
    await user.keyboard('{Escape}');

    // Assert
    expect(seen).not.toHaveBeenCalled();
  });
});
