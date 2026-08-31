import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotFoundState } from '@/components/feedback/not-found-state';

describe('NotFoundState', () => {
  it('renders the heading and a dashboard link', () => {
    render(<NotFoundState />);

    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to dashboard/i }),
    ).toHaveAttribute('href', '/club');
  });

  it('accepts a custom home href', () => {
    render(<NotFoundState homeHref="/login" />);

    expect(
      screen.getByRole('link', { name: /go to dashboard/i }),
    ).toHaveAttribute('href', '/login');
  });
});
