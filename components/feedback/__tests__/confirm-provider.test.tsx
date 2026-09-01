import { useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  ConfirmProvider,
  useConfirm,
} from '@/components/feedback/confirm-provider';

function Harness({
  options,
}: {
  options?: Partial<Parameters<ReturnType<typeof useConfirm>>[0]>;
}) {
  const confirm = useConfirm();
  const [result, setResult] = useState<string>('idle');
  const runsRef = useRef(0);

  return (
    <div>
      <button
        onClick={async () => {
          const n = ++runsRef.current;
          const ok = await confirm({
            title: 'Remove this player?',
            description: 'Their stats stay on record.',
            confirmLabel: 'Remove',
            ...options,
          });
          setResult(`${n}:${ok}`);
        }}
      >
        trigger
      </button>
      <output>{result}</output>
    </div>
  );
}

const renderHarness = () =>
  render(
    <ConfirmProvider>
      <Harness />
    </ConfirmProvider>,
  );

describe('useConfirm', () => {
  it('throws outside a ConfirmProvider', () => {
    expect(() => render(<Harness />)).toThrow(/ConfirmProvider/);
  });

  it('shows the dialog with the given copy', async () => {
    renderHarness();
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));

    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveTextContent('Remove this player?');
    expect(dialog).toHaveTextContent('Their stats stay on record.');
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('resolves true when confirmed', async () => {
    renderHarness();
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Remove' }),
    );

    expect(screen.getByRole('status')).toHaveTextContent('1:true');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('resolves false when cancelled', async () => {
    renderHarness();
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Cancel' }),
    );

    expect(screen.getByRole('status')).toHaveTextContent('1:false');
  });

  it('resolves false on Escape', async () => {
    renderHarness();
    await userEvent.click(screen.getByRole('button', { name: 'trigger' }));
    await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('1:false'),
    );
  });
});
