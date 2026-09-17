'use client';

import { copyShareLink } from '@/features/playbook/utils/copy-share-link';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/foundation/button/button';

type Props = {
  routeKey: string;
  playId: string;
};

export function ShareButton({ routeKey, playId }: Props) {
  return (
    <Button
      variant="darkGhost"
      aria-label="Share"
      onClick={() => copyShareLink(routeKey, playId)}
    >
      <Share2 className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Share</span>
    </Button>
  );
}
