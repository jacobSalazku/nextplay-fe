// Turn a play diagram into a PNG the coach can download. All client-side: we
// render the same <CourtDiagram> to an SVG string, rasterise it on a canvas,
// and hand back a Blob. The diagram has no external refs, so the canvas never
// taints.

// labels are single digits, so any sans-serif reads the same — pin a system
// stack so the export doesn't depend on a web font being loaded
const FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// px per court unit — a court is ~100 units wide, so this sets the output size
export const PHASE_SCALE = 8;
export const SHEET_SCALE = 4;

export function slugify(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  return slug || 'play';
}

// Wrap serialised SVG markup so it stands alone: xmlns, explicit pixel size
// (Safari needs it to rasterise), and the font pin.
export function standaloneSvg(
  inner: string,
  viewBox: string,
  width: number,
  height: number,
): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">` +
    `<style>text{font-family:${FONT_STACK}}</style>` +
    inner +
    `</svg>`
  );
}

export async function svgToPng(
  svg: string,
  width: number,
  height: number,
  scale: number,
): Promise<Blob> {
  await document.fonts?.ready;

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.width = width;
    image.height = height;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('could not render the diagram'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas is unavailable');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('export failed'))),
        'image/png',
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // give the download a tick to start before the URL goes away
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
