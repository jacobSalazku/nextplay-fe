import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from '@/components/feedback/error-state';

describe('ErrorState', () => {
  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('hides the retry button when no onRetry is given', () => {
    render(<ErrorState />);

    expect(
      screen.queryByRole('button', { name: /try again/i }),
    ).not.toBeInTheDocument();
  });

  it('points the escape link at the given home href', () => {
    render(<ErrorState homeHref="/team/abc/schedule" />);

    expect(
      screen.getByRole('link', { name: /go to dashboard/i }),
    ).toHaveAttribute('href', '/team/abc/schedule');
  });

  it('never renders a raw error message', () => {
    render(<ErrorState description="The data didn't come back." />);

    expect(screen.queryByText(/stack|prisma|undefined is not/i)).toBeNull();
  });
});
