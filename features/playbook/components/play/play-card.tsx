import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCategoryColor } from '../../utils/play-category-color';
import { useTeam } from '@/context/team-context';
import { toastStyling } from '@/features/toast-notification/styling';
import { cn } from '@/utils/tw-merge';
import { useMutation } from '@apollo/client/react';
import { Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DeletePlayDocument, Play } from '@/graphql/graphql';
import { Card, CardContent, CardFooter } from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';
import { CategoryBadge } from '@/components/foundation/category-badge';

type PlayCardProps = {
  play: Play;
  role: string;
};

export const PlayCard = ({ play, role }: PlayCardProps) => {
  const { teamRef } = useTeam();
  const router = useRouter();
  const [deletePlay] = useMutation(DeletePlayDocument);

  const handleDelete = async () => {
    try {
      await deletePlay({
        variables: { input: { teamRef, id: play.id } },
        refetchQueries: ['GetPlays'],
      });
      router.refresh();
      toast.success('Play deleted', {
        ...toastStyling,
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete play', {
        ...toastStyling,
        position: 'top-right',
      });
    }
  };

  return (
    <Card className="group relative cursor-pointer overflow-hidden rounded-2xl border border-orange-500/20 bg-linear-to-b from-slate-900/95 to-slate-950 text-xs text-white shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-orange-300/50">
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-amber-300 to-orange-500 opacity-80" />
      <div className="flex items-start justify-between px-4 py-4 md:px-0 md:py-1">
        <div className="flex w-full items-center justify-between gap-2 border-b border-white/10 py-4 md:border-none md:px-6">
          <span className="text-2xl font-bold transition-colors group-hover:text-orange-400 md:hidden">
            {play.name}
          </span>
          <CategoryBadge
            label={play.category}
            className={cn(getCategoryColor(play.category))}
          />
        </div>
      </div>
      <CardContent className="pt-0">
        <div className="relative mb-4 hidden aspect-video overflow-hidden rounded-xl border border-orange-500/20 bg-slate-950/70 md:block">
          <Image
            src={play.canvas || '/placeholder.png'}
            alt={`Diagram for ${play.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="group hidden flex-row items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-white/70 transition-colors hover:bg-slate-800/80 md:flex">
          <span className="text-lg font-semibold text-white/90 group-hover:text-orange-300">
            {play.name}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between pt-0 pb-5">
        <Link
          aria-label="View Play Details"
          variant="light"
          size="sm"
          href={{
            pathname: `/team/${teamRef}/playbook/play`,
            query: { id: play.id },
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Link>
        {role === 'COACH' && (
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
