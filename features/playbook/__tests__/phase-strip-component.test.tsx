import { PhaseStrip } from '../components/editor/phase-strip';
import type { Phase } from '../utils/diagram/types';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const makePhases = (n: number): Phase[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 50 }],
    actions: [],
  }));

function renderStrip(
  overrides: Partial<Parameters<typeof PhaseStrip>[0]> = {},
) {
  const props = {
    phases: makePhases(3),
    court: 'half' as const,
    activeIndex: 1,
    onSelect: vi.fn(),
    onAdd: vi.fn(),
    onDelete: vi.fn(),
    onReorder: vi.fn(),
    ...overrides,
  };
  render(<PhaseStrip {...props} />);
  return props;
}

afterEach(() => vi.restoreAllMocks());

describe('PhaseStrip', () => {
  it('shows a thumbnail per phase and marks the current one', () => {
    renderStrip();

    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(
      screen.getByRole('tab', { name: 'Phase 2, current' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('selects a phase on a plain click', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderStrip();

    await user.click(screen.getByRole('tab', { name: 'Phase 3' }));

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('adds and deletes phases', async () => {
    const user = userEvent.setup();
    const { onAdd, onDelete } = renderStrip();

    await user.click(screen.getByRole('button', { name: 'Add phase' }));
    await user.click(screen.getByRole('button', { name: 'Delete phase 1' }));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(0);
  });

  it('hides delete with one phase and add at the cap', () => {
    renderStrip({ phases: makePhases(1) });
    expect(
      screen.queryByRole('button', { name: /delete phase/i }),
    ).not.toBeInTheDocument();
  });

  it('reorders when a thumbnail is dragged', () => {
    // Arrange — every thumbnail reports the same wide box, so any drop lands at 0
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 1000,
      top: 0,
      bottom: 50,
      width: 1000,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    const { onReorder } = renderStrip();
    const thumb = screen.getByRole('tab', { name: 'Phase 3' });

    // Act — press, move past the threshold, release
    fireEvent.pointerDown(thumb, { pointerId: 1, clientX: 200 });
    fireEvent.pointerMove(thumb, { pointerId: 1, clientX: 40 });
    fireEvent.pointerUp(thumb, { pointerId: 1, clientX: 40 });

    // Assert
    expect(onReorder).toHaveBeenCalledWith(2, 0);
  });
});
