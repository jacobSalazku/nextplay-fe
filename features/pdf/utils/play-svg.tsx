import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import { CourtDiagram } from '@/features/playbook/components/diagram/court-diagram';
import type { CourtType, Phase } from '@/features/playbook/utils/diagram/types';
import { renderToStaticMarkup } from 'react-dom/server.edge';

// A phase's <CourtDiagram> as a data URI @react-pdf's <Image> can rasterise.
// @react-pdf only recognises SVG when it's handed a Buffer / base64 data URI —
// a bare string is treated as a file path. Server-side only.
export function phaseSvgUri(court: CourtType, phase: Phase): string {
  const { w, h } = COURT_VIEWBOX[court];

  const svg = renderToStaticMarkup(
    <CourtDiagram
      court={court}
      phase={phase}
      ballHolderId={phase.ballHolderId}
    />,
  )
    .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(
      /(<svg[^>]*>)/,
      `$1<rect width="${w}" height="${h}" fill="#ffffff"/>`,
    )
    // @react-pdf/svg has no <pattern>; fall back to the plain wood gradient
    .replace(/<pattern[\s\S]*?<\/pattern>/g, '')
    .replace(/url\(#court-planks\)/g, 'url(#court-wood)')
    // @react-pdf can't resolve a numeric weight for the base-14 fonts
    .replace(/font-weight="[^"]*"/g, 'font-family="Helvetica-Bold"')
    // …and it mis-reads rgba(); flatten translucent black to a solid grey
    .replace(/rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/g, (_, a) => {
      const g = Math.round(255 * (1 - Number(a)))
        .toString(16)
        .padStart(2, '0');
      return `#${g}${g}${g}`;
    });

  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;
}
