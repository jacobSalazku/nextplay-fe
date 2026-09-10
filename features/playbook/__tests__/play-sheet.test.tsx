import { PlaySheet } from '../components/sheet/play-sheet';
import type { PlayDiagram } from '../utils/diagram/types';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const diagram = (phases: PlayDiagram['phases']): PlayDiagram => ({
  version: 1,
  court: 'half',
  phases,
});

const obj = (id: string) =>
  ({ id, kind: 'offense', label: id.slice(-1), x: 50, y: 50 }) as const;

const base = {
  playName: 'Horns Flare',
  coachName: 'Mia Carter',
  category: 'OFFENSIVE',
  backHref: '/team/x/playbook/play/p1/edit',
};

describe('PlaySheet', () => {
  it('shows the masthead and a printable-page toolbar', () => {
    render(
      <PlaySheet
        {...base}
        diagram={diagram([{ id: 'p1', objects: [obj('o1')], actions: [] }])}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Horns Flare' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Mia Carter/)).toBeInTheDocument();
    expect(screen.getByText(/Offense/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /print \/ save as pdf/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to editor/i }),
    ).toHaveAttribute('href', base.backHref);
  });

  it('describes a phase the coach left blank from its actions', () => {
    render(
      <PlaySheet
        {...base}
        diagram={diagram([
          {
            id: 'p1',
            objects: [obj('o1'), obj('o3')],
            actions: [{ id: 'a', type: 'pass', fromId: 'o1', toId: 'o3' }],
          },
        ])}
      />,
    );

    // rendered twice (screen + print portal)
    expect(screen.getByText(/1 passes to 3/)).toBeInTheDocument();
    expect(screen.getByText('Movement')).toBeInTheDocument();
  });

  it('renders written notes as formatted text, sanitised', () => {
    render(
      <PlaySheet
        {...base}
        diagram={diagram([
          {
            id: 'p1',
            objects: [obj('o1')],
            actions: [],
            note: '<p>Read the <strong>help</strong></p><script>alert(1)</script>',
          },
        ])}
      />,
    );

    const notes = screen.getByText(/Read the/);
    expect(within(notes.closest('div')!).getByText('help').tagName).toBe(
      'STRONG',
    );
    expect(document.querySelector('script')).toBeNull();
  });
});
