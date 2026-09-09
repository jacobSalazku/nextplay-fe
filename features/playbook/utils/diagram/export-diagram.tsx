'use client';

import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  downloadBlob,
  PHASE_SCALE,
  SHEET_SCALE,
  slugify,
  standaloneSvg,
  svgToPng,
} from './export-image';
import type { CourtType, Phase } from './types';

// Render one phase's <CourtDiagram> on a detached root and read back the SVG
// children as a string — no server renderer, no always-mounted hidden nodes.
export function diagramInner(court: CourtType, phase: Phase): string {
  const host = document.createElement('div');
  const root = createRoot(host);
  flushSync(() =>
    root.render(
      <CourtDiagram
        court={court}
        phase={phase}
        ballHolderId={phase.ballHolderId}
      />,
    ),
  );
  const inner = host.querySelector('svg')?.innerHTML ?? '';
  root.unmount();
  if (!inner) throw new Error('the diagram did not render');
  return inner;
}

// escape for SVG / HTML text content
export const xmlText = (s: string) =>
  s.replace(/[<>&]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;',
  );

const gridCols = (n: number) => (n <= 2 ? n : n <= 6 ? 3 : 4);

const SHEET = {
  pad: 6, // outer margin, in court units
  gap: 5, // between cells
  caption: 7, // caption strip above each court
  titleH: 10,
  bg: '#ffffff',
  captionBg: '#1f2d4d',
  captionInk: '#ffffff',
  border: '#d8cbac',
};

export function phaseSheetSvg(
  court: CourtType,
  phases: Phase[],
  title: string,
): { svg: string; width: number; height: number } {
  const { w, h } = COURT_VIEWBOX[court];
  const cols = gridCols(phases.length);
  const rows = Math.ceil(phases.length / cols);
  const cellH = SHEET.caption + h;

  const width = SHEET.pad * 2 + cols * w + (cols - 1) * SHEET.gap;
  const height =
    SHEET.pad * 2 + SHEET.titleH + rows * cellH + (rows - 1) * SHEET.gap;

  const cells = phases.map((phase, i) => {
    const x = SHEET.pad + (i % cols) * (w + SHEET.gap);
    const y =
      SHEET.pad + SHEET.titleH + Math.floor(i / cols) * (cellH + SHEET.gap);

    // keep the <defs> from the first cell only; the rest reuse those ids
    let inner = diagramInner(court, phase);
    if (i > 0) inner = inner.replace(/<defs>[\s\S]*?<\/defs>/g, '');

    return (
      `<g transform="translate(${x} ${y})">` +
      `<rect width="${w}" height="${SHEET.caption}" fill="${SHEET.captionBg}"/>` +
      `<text x="${w / 2}" y="${SHEET.caption / 2 + 1.4}" text-anchor="middle" font-size="3.4" font-weight="700" fill="${SHEET.captionInk}">PHASE ${i + 1}</text>` +
      `<g transform="translate(0 ${SHEET.caption})">${inner}</g>` +
      `<rect width="${w}" height="${cellH}" fill="none" stroke="${SHEET.border}" stroke-width="0.4"/>` +
      `</g>`
    );
  });

  const body =
    `<rect width="${width}" height="${height}" fill="${SHEET.bg}"/>` +
    `<text x="${SHEET.pad}" y="${SHEET.pad + 6}" font-size="5" font-weight="700" fill="#1f2d4d">${xmlText(title)}</text>` +
    cells.join('');

  return {
    svg: standaloneSvg(body, `0 0 ${width} ${height}`, width, height),
    width,
    height,
  };
}

export function singlePhaseSvg(
  court: CourtType,
  phase: Phase,
): { svg: string; width: number; height: number } {
  const { w, h } = COURT_VIEWBOX[court];
  return {
    svg: standaloneSvg(
      `<rect width="${w}" height="${h}" fill="#ffffff"/>${diagramInner(court, phase)}`,
      `0 0 ${w} ${h}`,
      w,
      h,
    ),
    width: w,
    height: h,
  };
}

export async function exportPhasePng(
  court: CourtType,
  phase: Phase,
  playName: string,
  phaseNumber: number,
): Promise<void> {
  const { svg, width, height } = singlePhaseSvg(court, phase);
  const blob = await svgToPng(svg, width, height, PHASE_SCALE);
  downloadBlob(blob, `${slugify(playName)}-phase-${phaseNumber}.png`);
}

export async function exportSheetPng(
  court: CourtType,
  phases: Phase[],
  playName: string,
): Promise<void> {
  const { svg, width, height } = phaseSheetSvg(court, phases, playName);
  const blob = await svgToPng(svg, width, height, SHEET_SCALE);
  downloadBlob(blob, `${slugify(playName)}-all-phases.png`);
}
