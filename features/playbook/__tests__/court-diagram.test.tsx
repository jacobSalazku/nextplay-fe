import { CourtDiagram } from '../components/diagram/court-diagram';
import type { Phase } from '../utils/diagram/types';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const phase: Phase = {
  id: 'p1',
  objects: [
    { id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 },
    { id: 'o2', kind: 'offense', label: '2', x: 20, y: 55 },
    { id: 'o3', kind: 'offense', label: '3', x: 80, y: 55 },
    { id: 'o4', kind: 'offense', label: '4', x: 30, y: 25 },
    { id: 'o5', kind: 'offense', label: '5', x: 70, y: 25 },
    { id: 'x2', kind: 'defense', label: 'x2', x: 22, y: 60 },
    { id: 'x5', kind: 'defense', label: 'x5', x: 66, y: 30 },
  ],
  actions: [{ id: 'a1', type: 'pass', fromId: 'o1', toId: 'o5' }],
};

describe('CourtDiagram', () => {
  it('renders every token label in the phase', () => {
    // Act
    const { container } = render(<CourtDiagram court="half" phase={phase} />);

    // Assert
    const labels = [...container.querySelectorAll('text')].map(
      (t) => t.textContent,
    );
    expect(labels).toEqual(
      expect.arrayContaining(['1', '2', '3', '4', '5', 'x2', 'x5']),
    );
  });

  it('draws a dashed route with an arrowhead for a pass', () => {
    // Act
    const { container } = render(<CourtDiagram court="half" phase={phase} />);

    // Assert
    const route = container.querySelector('path[marker-end]');
    expect(route).not.toBeNull();
    expect(route?.getAttribute('stroke-dasharray')).toBe('3 2');
  });

  it('rings the ball holder', () => {
    // Act
    const { container } = render(
      <CourtDiagram court="half" phase={phase} ballHolderId="o1" />,
    );
    const withoutBall = render(<CourtDiagram court="half" phase={phase} />);

    // Assert — the held token has one extra circle (the ring)
    const held = container.querySelectorAll('g > circle').length;
    const plain = withoutBall.container.querySelectorAll('g > circle').length;
    expect(held).toBe(plain + 1);
  });

  it('renders just the court for an empty phase', () => {
    // Act
    const { container } = render(
      <CourtDiagram
        court="half"
        phase={{ ...phase, objects: [], actions: [] }}
      />,
    );

    // Assert
    expect(container.querySelectorAll('text')).toHaveLength(0);
  });

  it('uses a taller viewBox for a full court', () => {
    // Act
    const { container } = render(<CourtDiagram court="full" phase={phase} />);

    // Assert
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(
      '0 0 100 188',
    );
  });

  it('scales a normalized y into the full-court viewBox height', () => {
    // Arrange — a token at the very bottom of the court (y = 100)
    const bottom: Phase = {
      id: 'p1',
      objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 100 }],
      actions: [],
    };

    // Act
    const { container } = render(<CourtDiagram court="full" phase={bottom} />);

    // Assert — 100 maps to the full 188-unit height, not 100
    const token = container.querySelector('g[transform^="translate(50"]');
    expect(token?.getAttribute('transform')).toBe('translate(50 188)');
  });
});
