import { AddPhaseMenu } from '../components/editor/mobile/add-phase-menu';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const base = {
  activeIndex: 1,
  onClone: vi.fn(),
  onEmpty: vi.fn(),
  onClose: vi.fn(),
  variant: 'sheet' as const,
};

describe('AddPhaseMenu', () => {
  it('renders nothing while closed', () => {
    render(<AddPhaseMenu {...base} open={false} />);

    expect(screen.queryByRole('dialog', { name: 'Add phase' })).toBeNull();
  });

  it('clones the current phase', async () => {
    const user = userEvent.setup();
    const onClone = vi.fn();
    render(<AddPhaseMenu {...base} open onClone={onClone} />);

    await user.click(screen.getByRole('button', { name: 'Clone phase 2' }));

    expect(onClone).toHaveBeenCalledOnce();
  });

  it('adds an empty court and closes', async () => {
    const user = userEvent.setup();
    const onEmpty = vi.fn();
    const onClose = vi.fn();
    render(<AddPhaseMenu {...base} open onEmpty={onEmpty} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Empty court' }));

    expect(onEmpty).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes from Cancel and from the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AddPhaseMenu {...base} open onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
