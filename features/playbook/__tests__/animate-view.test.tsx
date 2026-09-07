import { AnimateView } from '../components/editor/animate/animate-view';
import type { Phase } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const phase = (id: string, x: number): Phase => ({
  id,
  objects: [{ id: 'o1', kind: 'offense', label: '1', x, y: 20 }],
  actions: [],
});

describe('AnimateView', () => {
  it('asks for a second phase when there is only one', () => {
    render(<AnimateView court="half" phases={[phase('p1', 10)]} />);

    expect(screen.getByText(/add a second phase/i)).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /animation/i })).toBeNull();
  });

  it('renders the animation stage once there are two phases', () => {
    render(
      <AnimateView court="half" phases={[phase('p1', 10), phase('p2', 80)]} />,
    );

    expect(
      screen.getByRole('img', { name: /play animation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
