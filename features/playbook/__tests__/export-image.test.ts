import {
  downloadBlob,
  slugify,
  standaloneSvg,
} from '../utils/diagram/export-image';
import { describe, expect, it, vi } from 'vitest';

describe('slugify', () => {
  it('lowercases and dashes a play name', () => {
    expect(slugify('Horns Flare II')).toBe('horns-flare-ii');
  });

  it('drops punctuation and collapses whitespace', () => {
    expect(slugify('  5-Out / Delay  (base) ')).toBe('5-out-delay-base');
  });

  it('falls back to "play" when nothing usable is left', () => {
    expect(slugify('***')).toBe('play');
    expect(slugify('')).toBe('play');
  });
});

describe('standaloneSvg', () => {
  it('wraps markup with an xmlns and an explicit pixel size', () => {
    const out = standaloneSvg('<rect/>', '0 0 10 20', 100, 200);

    expect(out).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(out).toContain('width="100"');
    expect(out).toContain('height="200"');
    expect(out).toContain('viewBox="0 0 10 20"');
    expect(out).toContain('<rect/>');
  });
});

describe('downloadBlob', () => {
  it('clicks a named download link for the blob', () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    downloadBlob(new Blob(['x'], { type: 'image/png' }), 'play-1.png');

    const link = click.mock.instances[0] as HTMLAnchorElement;
    expect(link.download).toBe('play-1.png');
    expect(link.href).toContain('blob:x');
    expect(document.querySelector('a[download]')).toBeNull(); // cleaned up

    vi.restoreAllMocks();
  });
});
