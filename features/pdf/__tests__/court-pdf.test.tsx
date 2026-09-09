import { CourtPdf } from '../court-pdf';
import type { Phase } from '@/features/playbook/utils/diagram/types';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// @react-pdf primitives → host elements we can query
vi.mock('@react-pdf/renderer', () => {
  const el = (tag: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) => {
      const attrs: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v === 'string' || typeof v === 'number') attrs[k] = v;
      }
      return (
        <div data-tag={tag} {...attrs}>
          {children as React.ReactNode}
        </div>
      );
    };
    C.displayName = tag;
    return C;
  };
  return {
    Svg: el('svg'),
    Defs: el('defs'),
    LinearGradient: el('lg'),
    Stop: el('stop'),
    Marker: el('marker'),
    G: el('g'),
    Rect: el('rect'),
    Circle: el('circle'),
    Line: el('line'),
    Path: el('path'),
    Text: el('text'),
  };
});

const phase: Phase = {
  id: 'p1',
  ballHolderId: 'o1',
  objects: [
    { id: 'o1', kind: 'offense', label: '1', x: 30, y: 80 },
    { id: 'x1', kind: 'defense', label: '1', x: 32, y: 70 },
  ],
  actions: [
    { id: 'a1', type: 'pass', fromId: 'o1', toPoint: { x: 60, y: 40 } },
  ],
};

describe('CourtPdf', () => {
  it('draws the surface, the route and every token', () => {
    const { container } = render(
      <CourtPdf court="half" phase={phase} width={200} />,
    );

    // wood surface + a route path + two token labels
    expect(
      container.querySelector('[data-tag="rect"][fill="url(#wood)"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-tag="path"][d]')).toBeTruthy();
    expect(container.querySelectorAll('[data-tag="text"]')).toHaveLength(2);
  });

  it('rings the ball handler', () => {
    const { container } = render(
      <CourtPdf court="half" phase={phase} width={200} />,
    );
    // the offense token has an extra ring circle (r = 3.6) when it holds the ball
    const rings = [...container.querySelectorAll('[data-tag="circle"]')].filter(
      (c) => c.getAttribute('stroke') === '#f97316',
    );
    expect(rings.length).toBe(1);
  });
});
