import { BreakdownView } from '../components/editor/breakdown/breakdown-view';
import { CategoryPicker } from '../components/editor/breakdown/category-picker';
import { PhaseRail } from '../components/editor/breakdown/phase-rail';
import type { Phase } from '../utils/diagram/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Category } from '@/graphql/graphql';

const phases = (n: number): Phase[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 50 }],
    actions: [],
    ...(i === 0 ? { note: '<p>Iso</p>' } : {}),
  }));

describe('CategoryPicker', () => {
  it('marks the active category and reports a pick', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryPicker value={Category.Offensive} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Offense' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Defense' }));

    expect(onChange).toHaveBeenCalledWith(Category.Defensive);
  });
});

describe('PhaseRail', () => {
  it('shows the phase counter and switches phase on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PhaseRail
        phases={phases(4)}
        court="half"
        activeIndex={1}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('Phase 2 / 4')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Phase 2' })).toHaveAttribute(
      'aria-current',
      'true',
    );

    await user.click(screen.getByRole('tab', { name: 'Phase 3' }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('adds a phase, and duplicates / deletes one from its menu', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onDelete = vi.fn();
    const onDuplicate = vi.fn();
    render(
      <PhaseRail
        phases={phases(3)}
        court="half"
        activeIndex={0}
        onSelect={vi.fn()}
        onAdd={onAdd}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Add phase' }));
    expect(onAdd).toHaveBeenCalledOnce();

    // the second phase's menu
    await user.click(
      screen.getAllByRole('button', { name: 'Phase options' })[1],
    );
    await user.click(screen.getByRole('button', { name: 'Duplicate' }));
    expect(onDuplicate).toHaveBeenCalledWith(1);

    await user.click(
      screen.getAllByRole('button', { name: 'Phase options' })[2],
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it('shows no menu or add card when those handlers are absent', () => {
    render(
      <PhaseRail
        phases={phases(3)}
        court="half"
        activeIndex={0}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Add phase' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Phase options' })).toBeNull();
  });
});

describe('BreakdownView', () => {
  const props = {
    category: Category.Offensive,
    court: 'half' as const,
    phases: phases(3),
    activeIndex: 0,
    onSelectPhase: vi.fn(),
    onAddPhase: vi.fn(),
    onDeletePhase: vi.fn(),
    onDuplicatePhase: vi.fn(),
    onReorderPhase: vi.fn(),
    onCategoryChange: vi.fn(),
    onNoteChange: vi.fn(),
    onEditStart: vi.fn(),
    onEditEnd: vi.fn(),
  };

  it('renders the selected phase heading, its note and the category picker', async () => {
    render(<BreakdownView {...props} />);

    expect(
      screen.getByRole('heading', { name: /Phase 1/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Iso')).toBeInTheDocument());
  });
});
