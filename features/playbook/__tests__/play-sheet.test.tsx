import { openPlaySheet } from '../utils/diagram/play-sheet';
import type { Phase } from '../utils/diagram/types';
import { afterEach, describe, expect, it, vi } from 'vitest';

const phase = (id: string, note?: string): Phase => ({
  id,
  note,
  objects: [{ id: 'o1', kind: 'offense', label: '1', x: 50, y: 80 }],
  actions: [],
});

function captureSheet(input: Parameters<typeof openPlaySheet>[0]) {
  let html = '';
  const win = {
    document: {
      write: (s: string) => (html += s),
      close: vi.fn(),
    },
  };
  const open = vi
    .spyOn(window, 'open')
    .mockReturnValue(win as unknown as Window);
  openPlaySheet(input);
  open.mockRestore();
  return html;
}

afterEach(() => vi.restoreAllMocks());

describe('openPlaySheet', () => {
  it('writes a sheet with the masthead and one block per phase', () => {
    const html = captureSheet({
      playName: 'Horns Flare',
      coachName: 'Mia Carter',
      category: 'OFFENSIVE',
      court: 'half',
      phases: [phase('p1', '<p>1 passes to 5</p>'), phase('p2'), phase('p3')],
    });

    expect(html).toContain('Horns Flare');
    expect(html).toContain('Mia Carter');
    expect(html).toContain('Offense');
    expect(html).toContain('1 passes to 5');
    expect(html.match(/class="phase"/g)).toHaveLength(3);
    expect(html).toContain('No notes for this phase.'); // p2 / p3
  });

  it('strips unsafe markup from a phase note', () => {
    const html = captureSheet({
      playName: 'x',
      coachName: 'x',
      category: 'SPECIAL',
      court: 'half',
      phases: [phase('p1', '<p>ok</p><script>alert(1)</script>')],
    });

    expect(html).toContain('<p>ok</p>');
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  it('throws when the pop-up is blocked', () => {
    vi.spyOn(window, 'open').mockReturnValue(null);
    expect(() =>
      openPlaySheet({
        playName: 'x',
        coachName: 'x',
        category: 'OFFENSIVE',
        court: 'half',
        phases: [phase('p1')],
      }),
    ).toThrow(/pop-up/i);
  });
});
