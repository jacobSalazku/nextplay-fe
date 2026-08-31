import { MapPinOff } from 'lucide-react';
import { Link } from '@/components/foundation/button/link';

type NotFoundStateProps = {
  kicker?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
};

export function NotFoundState({
  kicker = 'Lost the ball',
  title = 'Page not found',
  description = "This page doesn't exist. Check the link, or head back to your dashboard.",
  homeHref = '/club',
  homeLabel = 'Go to dashboard',
}: NotFoundStateProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-transparent px-4 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15">
          <MapPinOff className="h-7 w-7 text-orange-300" aria-hidden="true" />
        </div>
        <p className="mt-5 text-xs font-medium tracking-[0.24em] text-orange-300 uppercase">
          {kicker}
        </p>
        <h1 className="font-righteous mt-2 text-2xl text-white">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
          {description}
        </p>
        <div className="mt-6">
          <Link variant="primary" href={homeHref} className="rounded-full px-6">
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
