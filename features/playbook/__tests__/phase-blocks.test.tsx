import { PhaseBlocks } from '../components/sheet/phase-blocks';
import type { PlayDiagram } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const obj = (id: string) =>
  ({ id, kind: 'offense', label: id.slice(-1), x: 50, y: 50 }) as const;

const diagram = (phases: PlayDiagram['phases']): PlayDiagram => ({
  version: 1,
  court: 'half',
  phases,
});

describe('PhaseBlocks', () => {
  it('describes a phase with no written note from its drawn actions', () => {
    render(
      <PhaseBlocks
        theme="dark"
        diagram={diagram([
          {
            id: 'p1',
            objects: [obj('o1'), obj('o3')],
            actions: [{ id: 'a', type: 'pass', fromId: 'o1', toId: 'o3' }],
          },
        ])}
      />,
    );

    expect(screen.getByText(/1 passes to 3/)).toBeInTheDocument();
    expect(screen.getByText('Movement')).toBeInTheDocument();
  });

  it('calls a phase with no actions a reset', () => {
    render(
      <PhaseBlocks
        theme="dark"
        diagram={diagram([{ id: 'p1', objects: [obj('o1')], actions: [] }])}
      />,
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText(/players hold their spots/)).toBeInTheDocument();
  });

  it('renders a written note as sanitised rich text', () => {
    render(
      <PhaseBlocks
        theme="dark"
        diagram={diagram([
          {
            id: 'p1',
            objects: [obj('o1')],
            actions: [],
            note: '<p>Punch it <strong>inside</strong></p><script>alert(1)</script>',
          },
        ])}
      />,
    );

    expect(screen.getByText('inside').tagName).toBe('STRONG');
    expect(document.querySelector('script')).toBeNull();
  });

  it('gives every phase its own labelled court', () => {
    render(
      <PhaseBlocks
        theme="paper"
        diagram={diagram([
          { id: 'p1', objects: [obj('o1')], actions: [] },
          { id: 'p2', objects: [obj('o1')], actions: [] },
          { id: 'p3', objects: [obj('o1')], actions: [] },
        ])}
      />,
    );

    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByText('Phase 3')).toBeInTheDocument();
  });
});
