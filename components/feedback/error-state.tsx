'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';

type ErrorStateProps = {
  kicker?: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export function ErrorState({
  kicker = 'Something broke',
  title = 'This page hit an error',
  description = "The data didn't come back. Retrying often clears it; if not, head back and try again.",
  onRetry,
  homeHref = '/club',
  homeLabel = 'Go to dashboard',
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-transparent px-4 text-white">
      <div className="w-full max-w-md text-center">
        <AlertTriangle
          className="mx-auto h-10 w-10 text-red-300"
          aria-hidden="true"
        />
        <p className="mt-5 text-xs font-medium tracking-[0.24em] text-orange-300 uppercase">
          {kicker}
        </p>
        <h1 className="font-righteous mt-2 text-2xl text-white">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
          {description}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <Button
              variant="primary"
              className="rounded-full px-6"
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
          <Link variant="outline" href={homeHref} className="rounded-full px-6">
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
