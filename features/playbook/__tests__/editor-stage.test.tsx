import { EditorStage } from '../components/editor/editor-stage';
import type { Phase } from '../utils/diagram/types';
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

// jsdom gives every element a 0x0 box; pin the stage box so pointer math is
// predictable. useCourtPointer reads it off the wrapping <div>.
function pinBox(size = 200) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: size,
    height: size,
    right: size,
    bottom: size,
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

afterEach(() => vi.restoreAllMocks());

function renderStage(
  overrides: Partial<Parameters<typeof EditorStage>[0]> = {},
) {
  const spies = {
    onSelect: vi.fn(),
    onMove: vi.fn(),
    onDraw: vi.fn(),
    onBend: vi.fn(),
    onRotate: vi.fn(),
    onDelete: vi.fn(),
  };
  render(
    <EditorStage
      court="half"
      phase={phase}
      tool="select"
      selection={null}
      {...spies}
      {...overrides}
    />,
  );
  return spies;
}

describe('EditorStage — select tool', () => {
  it('labels a grab target for every token', () => {
    renderStage();

    expect(screen.getByRole('button', { name: 'Move 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move 2' })).toBeInTheDocument();
  });

  it('selects a token when it is pressed', () => {
    // Arrange
    const { onSelect } = renderStage();

    // Act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Move 1' }), {
      pointerId: 1,
    });

    // Assert
    expect(onSelect).toHaveBeenCalledWith({ kind: 'object', id: 'o1' });
  });

  it('moves the dragged token to the pointer, clamped to the court', () => {
    // Arrange
    pinBox();
    const { onMove } = renderStage();
    const token = screen.getByRole('button', { name: 'Move 2' });

    // Act
    fireEvent.pointerDown(token, { pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(token, { pointerId: 1, clientX: 400, clientY: -80 });

    // Assert
    expect(onMove).toHaveBeenLastCalledWith('o2', 100, 0);
  });

  it('clears the selection when the empty court is pressed', () => {
    // Arrange
    const { onSelect } = renderStage({
      selection: { kind: 'object', id: 'o1' },
    });

    // Act
    fireEvent.pointerDown(
      screen.getByRole('application').querySelector(':scope > rect')!,
    );

    // Assert
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('selects a route when its hit path is pressed', () => {
    // Arrange
    const withRoute: Phase = {
      ...phase,
      actions: [{ id: 'a1', type: 'pass', fromId: 'o1', toId: 'o2' }],
    };
    const { onSelect } = renderStage({ phase: withRoute });

    // Act
    fireEvent.pointerDown(
      screen.getByRole('application').querySelector(':scope > path')!,
    );

    // Assert
    expect(onSelect).toHaveBeenCalledWith({ kind: 'action', id: 'a1' });
  });
});

describe('EditorStage — drawing an action', () => {
  it('draws onto another token when the drag ends on it', () => {
    // Arrange
    pinBox();
    const { onDraw } = renderStage({ tool: 'pass' });
    const from = screen.getByRole('button', { name: 'Draw from 1' });

    // Act — press on o1 (25,25 => 50px), release on o2 (75,75 => 150px)
    fireEvent.pointerDown(from, { pointerId: 1, clientX: 50, clientY: 50 });
    fireEvent.pointerMove(from, { pointerId: 1, clientX: 150, clientY: 150 });
    fireEvent.pointerUp(from, { pointerId: 1, clientX: 150, clientY: 150 });

    // Assert
    expect(onDraw).toHaveBeenCalledWith('o1', { toId: 'o2' });
  });

  it('draws to a free point when the drag ends on empty court', () => {
    // Arrange
    pinBox();
    const { onDraw } = renderStage({ tool: 'cut' });
    const from = screen.getByRole('button', { name: 'Draw from 1' });

    // Act — release at 90px => court 45,45 (nothing nearby)
    fireEvent.pointerDown(from, { pointerId: 1, clientX: 50, clientY: 50 });
    fireEvent.pointerUp(from, { pointerId: 1, clientX: 90, clientY: 90 });

    // Assert
    expect(onDraw).toHaveBeenCalledWith('o1', { toPoint: { x: 45, y: 45 } });
  });

  it('discards a drag that is too short', () => {
    // Arrange
    pinBox();
    const { onDraw } = renderStage({ tool: 'cut' });
    const from = screen.getByRole('button', { name: 'Draw from 1' });

    // Act — barely moved
    fireEvent.pointerDown(from, { pointerId: 1, clientX: 50, clientY: 50 });
    fireEvent.pointerUp(from, { pointerId: 1, clientX: 52, clientY: 52 });

    // Assert
    expect(onDraw).not.toHaveBeenCalled();
  });
});

describe('EditorStage — editing a selection', () => {
  const withStuff: Phase = {
    id: 'p1',
    objects: [
      { id: 'o1', kind: 'offense', label: '1', x: 25, y: 25 },
      { id: 'o2', kind: 'offense', label: '2', x: 75, y: 75 },
      { id: 'x1', kind: 'defense', label: 'x1', x: 50, y: 50 },
    ],
    actions: [{ id: 'a1', type: 'pass', fromId: 'o1', toId: 'o2' }],
  };
  const selectAction = { kind: 'action', id: 'a1' } as const;

  it('bends the selected route by the midpoint offset', () => {
    // Arrange — bend handle is at the chord midpoint (50,50)
    pinBox();
    const { onBend } = renderStage({
      phase: withStuff,
      selection: selectAction,
    });
    const handle = screen.getByRole('button', { name: 'Bend route' });

    // Act — drag it to court (50, 70) => clientY 140
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100, clientY: 140 });

    // Assert
    expect(onBend).toHaveBeenLastCalledWith('a1', { x: 0, y: 20 });
  });

  it('straightens the route when the handle returns near the midpoint', () => {
    // Arrange
    pinBox();
    const { onBend } = renderStage({
      phase: withStuff,
      selection: selectAction,
    });
    const handle = screen.getByRole('button', { name: 'Bend route' });

    // Act — barely off the midpoint
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 102, clientY: 102 });

    // Assert
    expect(onBend).toHaveBeenLastCalledWith('a1', undefined);
  });

  it('deletes the selection from the on-canvas control', () => {
    // Arrange
    const { onDelete } = renderStage({
      phase: withStuff,
      selection: selectAction,
    });

    // Act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Delete' }));

    // Assert
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('rotates the selected defender', () => {
    // Arrange
    pinBox();
    const { onRotate } = renderStage({
      phase: withStuff,
      selection: { kind: 'object', id: 'x1' },
    });
    const handle = screen.getByRole('button', { name: 'Rotate defender' });

    // Act — drag to straight below the token (50, 60)
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 118, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100, clientY: 120 });

    // Assert — 90deg (down, in screen coords)
    expect(onRotate).toHaveBeenLastCalledWith('x1', 90);
  });

  it('offers no rotation handle for an offense token', () => {
    // Act
    renderStage({ phase: withStuff, selection: { kind: 'object', id: 'o1' } });

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Rotate defender' }),
    ).not.toBeInTheDocument();
  });
});
