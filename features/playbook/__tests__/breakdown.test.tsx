import { BreakdownView } from '../components/editor/breakdown/breakdown-view';
import { PlayMeta } from '../components/editor/breakdown/play-meta';
import type { Phase } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Category } from '@/graphql/graphql';

const phases = (n: number): Phase[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 50 }],
    actions: [],
    ...(i === 0 ? { note: 'Iso' } : {}),
  }));

describe('PlayMeta', () => {
  it('renames on blur when the title changed', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <PlayMeta
        name="Horns"
        category={Category.Offensive}
        onRename={onRename}
        onCategoryChange={vi.fn()}
      />,
    );

    // Act
    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, 'Horns flare');
    await user.tab();

    // Assert
    expect(onRename).toHaveBeenCalledWith('Horns flare');
  });

  it('does not rename when the title is unchanged', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <PlayMeta
        name="Horns"
        category={Category.Offensive}
        onRename={onRename}
        onCategoryChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('textbox'));
    await user.tab();

    expect(onRename).not.toHaveBeenCalled();
  });

  it('picks a category', async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    render(
      <PlayMeta
        name="Horns"
        category={Category.Offensive}
        onRename={vi.fn()}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByRole('button', { name: 'Offense' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Defense' }));

    expect(onCategoryChange).toHaveBeenCalledWith(Category.Defensive);
  });
});

describe('BreakdownView', () => {
  const props = {
    name: 'Horns',
    category: Category.Offensive,
    court: 'half' as const,
    phases: phases(3),
    onRename: vi.fn(),
    onCategoryChange: vi.fn(),
    onNoteChange: vi.fn(),
    onEditStart: vi.fn(),
    onEditEnd: vi.fn(),
  };

  it('shows a note card per phase with the current note', () => {
    render(<BreakdownView {...props} />);

    expect(
      screen.getByRole('heading', { name: 'Phase 1' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Phase 3' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Phase 1 note')).toHaveValue('Iso');
  });

  it('reports a note edit with its phase index', async () => {
    const user = userEvent.setup();
    const onNoteChange = vi.fn();
    render(<BreakdownView {...props} onNoteChange={onNoteChange} />);

    const note = screen.getByLabelText('Phase 2 note');
    await user.type(note, 'x');

    expect(onNoteChange).toHaveBeenLastCalledWith(1, 'x');
  });

  it('brackets an edit with start/end for undo grouping', async () => {
    const user = userEvent.setup();
    const onEditStart = vi.fn();
    const onEditEnd = vi.fn();
    render(
      <BreakdownView
        {...props}
        onEditStart={onEditStart}
        onEditEnd={onEditEnd}
      />,
    );

    await user.click(screen.getByLabelText('Phase 3 note'));
    await user.tab();

    expect(onEditStart).toHaveBeenCalledOnce();
    expect(onEditEnd).toHaveBeenCalledOnce();
  });
});
