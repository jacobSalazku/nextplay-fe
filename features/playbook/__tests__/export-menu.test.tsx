import { ExportMenu } from '../components/editor/export-menu';
import type { Phase } from '../utils/diagram/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const exportSheetPng = vi.fn<(...args: unknown[]) => Promise<void>>(
  async () => {},
);
const exportPhasePng = vi.fn<(...args: unknown[]) => Promise<void>>(
  async () => {},
);
vi.mock('../utils/diagram/export-diagram', () => ({
  exportSheetPng: (...args: unknown[]) => exportSheetPng(...args),
  exportPhasePng: (...args: unknown[]) => exportPhasePng(...args),
}));

const openPlaySheet = vi.fn();
vi.mock('../utils/diagram/play-sheet', () => ({
  openPlaySheet: (...args: unknown[]) => openPlaySheet(...args),
}));

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: { error: (...a: unknown[]) => toastError(...a) },
}));

const phases: Phase[] = [
  { id: 'p1', objects: [], actions: [] },
  { id: 'p2', objects: [], actions: [] },
];

const props = {
  court: 'half' as const,
  phases,
  activeIndex: 1,
  playName: 'Zone Set',
  category: 'OFFENSIVE',
};

beforeEach(() => vi.clearAllMocks());

describe('ExportMenu', () => {
  it('opens a printable coaching sheet for the whole play', async () => {
    const user = userEvent.setup();
    render(<ExportMenu {...props} />);

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('button', { name: /Coaching sheet/ }));

    expect(openPlaySheet).toHaveBeenCalledWith(
      expect.objectContaining({
        playName: 'Zone Set',
        category: 'OFFENSIVE',
        court: 'half',
        phases,
      }),
    );
  });

  it('exports every phase on one image', async () => {
    const user = userEvent.setup();
    render(<ExportMenu {...props} />);

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('button', { name: /All phases/ }));

    expect(exportSheetPng).toHaveBeenCalledWith('half', phases, 'Zone Set');
  });

  it('exports the phase the coach is on', async () => {
    const user = userEvent.setup();
    render(<ExportMenu {...props} />);

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('button', { name: /Current phase/ }));

    expect(exportPhasePng).toHaveBeenCalledWith(
      'half',
      phases[1],
      'Zone Set',
      2,
    );
  });

  it('toasts when an export throws', async () => {
    exportSheetPng.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    render(<ExportMenu {...props} />);

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('button', { name: /All phases/ }));

    expect(await screen.findByRole('button', { name: 'Export' })).toBeEnabled();
    expect(toastError).toHaveBeenCalled();
  });
});
