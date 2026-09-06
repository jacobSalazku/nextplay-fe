import { EditorStage } from '../editor-stage';
import type { Phase } from '@/features/playbook/diagram/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const phase: Phase = {
  id: 'p1',
  objects: [
    { id: 'o1', kind: 'offense', label: '1', x: 25, y: 25 },
    { id: 'o2', kind: 'offense', label: '2', x: 75, y: 75 },
  ],
  actions: [],
};

// jsdom gives every element a 0x0 box; pin one so pointer math is predictable.
function pinBox(width = 200, height = 200) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width,
    height,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => {},
  });
}

afterEach(() => vi.restoreAllMocks());

function renderStage(
  overrides: Partial<Parameters<typeof EditorStage>[0]> = {},
) {
  const onSelect = vi.fn();
  const onMove = vi.fn();
  render(
    <EditorStage
      court="half"
      phase={phase}
      selectedId={null}
      onSelect={onSelect}
      onMove={onMove}
      {...overrides}
    />,
  );
  return { onSelect, onMove };
}

describe('EditorStage', () => {
  it('renders a labelled drag handle for every token', () => {
    // Act
    renderStage();

    // Assert
    expect(screen.getByRole('button', { name: 'Move 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move 2' })).toBeInTheDocument();
  });

  it('selects a token when its handle is pressed', () => {
    // Arrange
    const { onSelect } = renderStage();

    // Act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Move 1' }), {
      pointerId: 1,
    });

    // Assert
    expect(onSelect).toHaveBeenCalledWith('o1');
  });

  it('moves the dragged token to the pointer, in court coordinates', () => {
    // Arrange
    pinBox(200, 200);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { onMove } = renderStage();
    const handle = screen.getByRole('button', { name: 'Move 1' });

    // Act — press, then drag to the centre of a 200px box
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 50, clientY: 50 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100, clientY: 100 });

    // Assert
    expect(onMove).toHaveBeenLastCalledWith('o1', 50, 50);
  });

  it('clamps a drag past the sideline to the court edge', () => {
    // Arrange
    pinBox(200, 200);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { onMove } = renderStage();
    const handle = screen.getByRole('button', { name: 'Move 2' });

    // Act
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 400, clientY: -80 });

    // Assert
    expect(onMove).toHaveBeenLastCalledWith('o2', 100, 0);
  });

  it('clears the selection when the empty court is pressed', () => {
    // Arrange
    const { onSelect } = renderStage({ selectedId: 'o1' });

    // Act — the aspect-locked box is the only non-button, non-svg element
    const box = document.querySelector('div[style*="aspect-ratio"]')!;
    fireEvent.pointerDown(box);

    // Assert
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
