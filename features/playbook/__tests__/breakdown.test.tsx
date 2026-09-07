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
    expect(screen.getByRole('button', { name: 'Phase 2' })).toHaveAttribute(
      'aria-current',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Phase 3' }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe('BreakdownView', () => {
  const props = {
    category: Category.Offensive,
    court: 'half' as const,
    phases: phases(3),
    activeIndex: 0,
    onSelectPhase: vi.fn(),
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
