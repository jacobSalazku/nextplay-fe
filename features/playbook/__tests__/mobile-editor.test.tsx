import { PlayEditor } from '../components/editor/play-editor';
import type { PlacedObject } from '@/features/playbook/utils/diagram/types';
import { seedDiagram } from '@/features/playbook/utils/editor/seed-diagram';
import { usePlayEditorStore } from '@/store/use-play-editor-store';
import { renderWithClient } from '@/test/utils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Category } from '@/graphql/graphql';

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

const store = () => usePlayEditorStore.getState();

function renderEditor() {
  return renderWithClient(
    <PlayEditor
      playId="play-1"
      routeKey="team~1"
      name="Horns"
      category={Category.Offensive}
      diagram={seedDiagram('half', objects)}
    />,
  );
}

// Force the editor's `useIsMobile(768)` to report a narrow viewport.
beforeEach(() => {
  usePlayEditorStore.getState().reset();
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('PlayEditor — mobile', () => {
  it('switches screens from the bottom tab bar', async () => {
    // Arrange
    const user = userEvent.setup();
    renderEditor();
    const tabs = screen.getByRole('tablist', { name: 'Editor mode' });

    // Act
    await user.click(within(tabs).getByRole('tab', { name: 'Breakdown' }));

    // Assert — the Breakdown notes panel is now on screen
    expect(
      screen.getByRole('heading', { name: 'Step notes' }),
    ).toBeInTheDocument();
  });

  it('adds a phase from the switcher and jumps back to the first', async () => {
    // Arrange
    const user = userEvent.setup();
    renderEditor();

    // Act — add an empty phase (now on phase 2), then go back to phase 1
    await user.click(screen.getByRole('button', { name: /Phase 1 \/ 1/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Add phase' }));
    await user.click(screen.getByRole('button', { name: 'Empty court' }));

    expect(store().phases).toHaveLength(2);
    expect(store().activePhaseIndex).toBe(1);

    await user.click(screen.getByRole('button', { name: /Phase 2 \/ 2/ }));
    await user.click(screen.getByRole('menuitemradio', { name: /Phase 1$/ }));

    // Assert
    expect(store().activePhaseIndex).toBe(0);
  });

  it('benches a player from the roster sheet', async () => {
    // Arrange
    const user = userEvent.setup();
    renderEditor();

    // Act
    await user.click(screen.getByRole('button', { name: 'Roster' }));
    const sheet = screen.getByRole('dialog', { name: 'Roster' });
    await user.click(
      within(sheet).getByRole('button', { name: 'Player 1, on court' }),
    );

    // Assert — o1 is off the court now
    expect(store().phases[0].objects.some((o) => o.id === 'o1')).toBe(false);
  });
});
