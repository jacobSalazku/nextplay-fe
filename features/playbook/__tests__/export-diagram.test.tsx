import { COURT_VIEWBOX } from '../components/diagram/court';
import { phaseSheetSvg, singlePhaseSvg } from '../utils/diagram/export-diagram';
import type { Phase } from '../utils/diagram/types';
import { describe, expect, it } from 'vitest';

const phase = (id: string): Phase => ({
  id,
  objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 }],
  actions: [],
});

const parse = (svg: string) =>
  new DOMParser().parseFromString(svg, 'image/svg+xml');

describe('singlePhaseSvg', () => {
  it('is a standalone SVG sized to the court', () => {
    const { svg, width, height } = singlePhaseSvg('half', phase('p1'));
    const { w, h } = COURT_VIEWBOX.half;

    expect(width).toBe(w);
    expect(height).toBe(h);
    const doc = parse(svg);
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(doc.documentElement.getAttribute('width')).toBe(String(w));
  });
});

describe('phaseSheetSvg', () => {
  it('lays every phase out in a labelled grid', () => {
    const phases = [phase('p1'), phase('p2'), phase('p3'), phase('p4')];
    const { svg, width, height } = phaseSheetSvg('half', phases, 'My Play');

    const doc = parse(svg);
    expect(doc.querySelector('parsererror')).toBeNull();

    // 4 phases ⇒ a 3-wide grid, 2 rows
    const captions = [...doc.querySelectorAll('text')].map(
      (t) => t.textContent,
    );
    expect(captions).toContain('My Play');
    expect(captions).toContain('PHASE 1');
    expect(captions).toContain('PHASE 4');

    const { w } = COURT_VIEWBOX.half;
    expect(width).toBe(6 * 2 + 3 * w + 2 * 5);
    expect(height).toBeGreaterThan(0);
  });

  it('does not repeat <defs> per cell — later cells reuse the first cell ids', () => {
    const two = parse(
      phaseSheetSvg('half', [phase('p1'), phase('p2')], 'x').svg,
    );
    const six = parse(
      phaseSheetSvg(
        'half',
        Array.from({ length: 6 }, (_, i) => phase(`p${i}`)),
        'x',
      ).svg,
    );

    expect(six.querySelectorAll('defs').length).toBe(
      two.querySelectorAll('defs').length,
    );
  });
});
