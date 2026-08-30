import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCategoryColor } from '../../utils/play-category-color';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { gqlRequest } from '@/lib/graphql/client-request';
import { DeletePlayDocument, Play } from '@/graphql/graphql';
import { Card, CardContent } from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';

type PlayCardProps = {
  play: Play;
  role: string;
};

function resolvePlayImageSrc(canvas?: string | null): string {
  if (!canvas) return '/placeholder.png';

  const value = canvas.trim();
  if (!value) return '/placeholder.png';

  // Data URLs from the play form are valid and should render.
  if (value.startsWith('data:image/')) return value;

  // Local public assets (e.g. /placeholder.png)
  if (value.startsWith('/')) return value;

  // Allow explicit remote URLs only when valid.
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      new URL(value);
      return value;
    } catch {
      return '/placeholder.png';
    }
  }

  // Seed/debug values like JSON blobs should not go into <Image src>.
  return '/placeholder.png';
}

export const PlayCard = ({ play, role }: PlayCardProps) => {
  const { routeKey } = useTeam();
  const router = useRouter();
  const { mutate: deletePlay } = useMutation({
    mutationFn: () =>
      gqlRequest(DeletePlayDocument, { input: { routeKey, id: play.id } }),
    onSuccess: () => {
      router.refresh();
      toast.success('Play deleted', {
        ...toastStyling,
        position: 'top-right',
      });
    },
  });
  const imageSrc = resolvePlayImageSrc(play.canvas);
  const summary = (play.description ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden rounded-[28px] border border-orange-300/25 bg-slate-900 text-xs text-white shadow-[0_14px_28px_rgba(7,12,25,0.42)] ring-1 ring-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300/50">
      <div className="absolute top-0 left-0 z-30 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500" />
      <CardContent className="p-0">
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src={imageSrc}
            alt={`Diagram for ${play.name}`}
            fill
            unoptimized={imageSrc.startsWith('data:image/')}
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/10 via-slate-900/15 to-slate-900/70" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(251,146,60,0.2),transparent_36%),linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_30%)] opacity-70" />

          <div className="absolute top-4 right-4 left-4 z-20 flex items-start justify-between">
            <span
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md',
                getCategoryColor(play.category),
              )}
            >
              {play.category}
            </span>
            {role === 'COACH' && (
              <Button
                aria-label="Delete play"
                variant="danger"
                size="icon"
                className="h-9 w-9 rounded-full border border-white/35 bg-slate-900/45 text-white backdrop-blur-md hover:bg-red-600"
                onClick={() => deletePlay()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-white/15">
          <Image
            src={imageSrc}
            alt=""
            fill
            aria-hidden
            unoptimized={imageSrc.startsWith('data:image/')}
            className="pointer-events-none object-cover object-[center_88%] scale-160 blur-[3px] opacity-28"
          />
          <div className="absolute inset-0 bg-slate-900/52 backdrop-blur-[2px]" />

          <div className="relative z-10 flex flex-col gap-3 p-3 sm:p-4">
            <div className="mb-0.5">
              <h3 className="line-clamp-2 text-lg leading-5.5 font-bold tracking-tight text-white drop-shadow-sm sm:text-xl sm:leading-6">
                {play.name}
              </h3>
            </div>

            <p className="line-clamp-1 text-[13px] leading-4.5 text-white/80 sm:text-sm">
              {summary || 'Open this play to see the full diagram and notes.'}
            </p>

            <Link
              aria-label="View Play Details"
              variant="primary"
              size="full"
              className="h-9 rounded-full text-[13px] font-bold tracking-wide"
              href={{
                pathname: `/team/${routeKey}/playbook/play`,
                query: { id: play.id },
              }}
            >
              View Playbook
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
