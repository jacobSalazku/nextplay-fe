'use client';

import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';
import { diagramInner, xmlText } from './export-diagram';
import type { CourtType, Phase } from './types';

type SheetInput = {
  playName: string;
  coachName: string;
  category: string; // DEFENSIVE | OFFENSIVE | SPECIAL
  court: CourtType;
  phases: Phase[];
};

const CATEGORY_LABEL: Record<string, string> = {
  OFFENSIVE: 'Offense',
  DEFENSIVE: 'Defense',
  SPECIAL: 'Special teams',
};

const today = () =>
  new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// A print-ready coaching sheet: masthead, then every phase with its court on
// the left and its step notes on the right. Opens in its own window so the app
// chrome (and its h-screen / overflow-hidden layout) is out of the way, and the
// document can flow across as many pages as it needs.
function sheetHtml({
  playName,
  coachName,
  category,
  court,
  phases,
}: SheetInput): string {
  const { w, h } = COURT_VIEWBOX[court];

  const phaseBlocks = phases
    .map((phase, i) => {
      const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${diagramInner(court, phase)}</svg>`;
      const notes = sanitizeRichText(phase.note);
      return `
        <section class="phase">
          <div class="court">
            <span class="tag">Phase ${i + 1}</span>
            <div class="frame">${svg}</div>
          </div>
          <div class="notes">
            ${notes || '<p class="empty">No notes for this phase.</p>'}
          </div>
        </section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${xmlText(playName)} — coaching sheet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #1b1b1b;
    --navy: #1f2d4d;
    --accent: #f97316;
    --muted: #736b57;
    --rule: #e4dcc9;
    --display: "Righteous", "Trebuchet MS", system-ui, sans-serif;
    --serif: Georgia, "Iowan Old Style", "Times New Roman", serif;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #f3f2ee; color: var(--ink); }
  body { font-family: var(--serif); line-height: 1.5; }

  .controls {
    position: sticky; top: 0; z-index: 10;
    display: flex; gap: 10px; align-items: center; justify-content: center;
    padding: 10px; background: var(--navy); color: #fff;
    font-family: var(--sans); font-size: 13px;
  }
  .controls button {
    font: inherit; cursor: pointer; border: 0; border-radius: 999px;
    padding: 7px 16px; background: var(--accent); color: #fff; font-weight: 600;
  }
  .controls button.ghost { background: transparent; box-shadow: inset 0 0 0 1px rgba(255,255,255,.4); }

  .sheet {
    max-width: 210mm; margin: 16px auto 40px; padding: 18mm 16mm 22mm;
    background: #fff; box-shadow: 0 8px 40px rgba(0,0,0,.14);
  }

  .masthead { margin-bottom: 10mm; }
  .wordmark {
    font-family: var(--display); font-size: 13px; letter-spacing: .28em;
    color: var(--navy); text-transform: uppercase;
  }
  .title {
    font-family: var(--display); font-weight: 400;
    font-size: 34px; line-height: 1.1; color: var(--navy);
    margin: 4px 0 6px; text-wrap: balance;
  }
  .meta {
    font-family: var(--sans); font-size: 12.5px; color: var(--muted);
    letter-spacing: .02em;
  }
  .meta b { color: var(--ink); font-weight: 600; }
  .rule {
    margin-top: 8mm; height: 2px; background: var(--navy); position: relative;
  }
  .rule::before {
    content: ""; position: absolute; left: 0; top: 0; width: 34px; height: 2px;
    background: var(--accent);
  }

  .phase {
    display: grid; grid-template-columns: 38% 1fr; gap: 10mm;
    padding: 9mm 0; align-items: start;
    break-inside: avoid; page-break-inside: avoid;
  }
  .phase + .phase { border-top: 1px solid var(--rule); }

  .court .tag {
    display: inline-block; font-family: var(--sans); font-size: 10.5px;
    font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    color: #fff; background: var(--navy);
    padding: 3px 9px; border-radius: 4px; margin-bottom: 6px;
  }
  .frame {
    border: 1px solid var(--rule); padding: 4px; background: #fff;
    line-height: 0;
  }
  .frame svg { width: 100%; height: auto; }

  .notes { font-size: 13.5px; }
  .notes :first-child { margin-top: 0; }
  .notes :last-child { margin-bottom: 0; }
  .notes p { margin: 0 0 .55em; }
  .notes ul, .notes ol { margin: 0 0 .55em; padding-left: 1.25em; }
  .notes li { margin: .12em 0; }
  .notes h1, .notes h2, .notes h3 {
    font-family: var(--sans); color: var(--navy); line-height: 1.25;
    margin: 0 0 .35em; font-size: 15px;
  }
  .notes mark { background: #fdf1c4; padding: 0 .1em; }
  .notes .empty { color: var(--muted); font-style: italic; }

  .foot {
    margin-top: 10mm; padding-top: 4mm; border-top: 1px solid var(--rule);
    display: flex; justify-content: space-between;
    font-family: var(--sans); font-size: 10.5px; color: var(--muted);
  }

  @media print {
    html, body { background: #fff; }
    .controls { display: none; }
    .sheet { max-width: none; margin: 0; padding: 0; box-shadow: none; }
    @page { size: A4; margin: 14mm; }
  }
</style>
</head>
<body>
  <div class="controls">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button class="ghost" onclick="window.close()">Close</button>
  </div>

  <article class="sheet">
    <header class="masthead">
      <div class="wordmark">NextPlay</div>
      <h1 class="title">${xmlText(playName)}</h1>
      <div class="meta">
        <b>${xmlText(coachName)}</b> &nbsp;·&nbsp;
        ${xmlText(CATEGORY_LABEL[category] ?? category)} &nbsp;·&nbsp;
        ${xmlText(today())}
      </div>
      <div class="rule"></div>
    </header>

    ${phaseBlocks}

    <div class="foot">
      <span>NextPlay — ${xmlText(playName)}</span>
      <span>${phases.length} ${phases.length === 1 ? 'phase' : 'phases'}</span>
    </div>
  </article>

  <script>
    (async () => {
      try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
      requestAnimationFrame(() => setTimeout(() => window.print(), 120));
    })();
  </script>
</body>
</html>`;
}

export function openPlaySheet(input: SheetInput): void {
  // a real window (not noopener) so we can write the document into it
  const win = window.open('', '_blank');
  if (!win) {
    throw new Error('pop-up blocked');
  }
  win.document.write(sheetHtml(input));
  win.document.close();
}
