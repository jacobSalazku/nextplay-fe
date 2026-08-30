import type { UrlObject } from 'url';
import { Calendar, Eye, PlayIcon, Trash2 } from 'lucide-react';
import { GamePlan, PracticePreparation } from '@/graphql/graphql';
import { Card, CardFooter, CardHeader } from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';
import { CategoryBadge } from '@/components/foundation/category-badge';

type PlanCardProps = {
  plan: GamePlan | PracticePreparation;
  onView: string | UrlObject;
  onDelete: () => void;
  role: string;
};
const MAX_VISIBLE_PLAY_BADGES = 2;

function formatActivityDate(value: unknown): string {
  if (!value) {
    return 'No date set';
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(parsedDate.getTime())) {
    return 'No date set';
  }

  return parsedDate.toISOString().split('T')[0];
}

export const PlanCard = ({ plan, onView, onDelete, role }: PlanCardProps) => {
  const isGameplan = 'opponent' in plan;
  const isPractice = 'focus' in plan;
  const accentClass = isGameplan
    ? 'from-orange-500 via-amber-300 to-orange-500'
    : 'from-blue-500 via-cyan-300 to-blue-500';
  const visiblePlays = plan.plays.slice(0, MAX_VISIBLE_PLAY_BADGES);
  const hiddenPlayCount = Math.max(0, plan.plays.length - visiblePlays.length);

  return (
    <Card className="group relative flex h-full flex-col items-center justify-between gap-2 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 text-sm text-white shadow-md transition-all duration-200 hover:border-orange-300/40">
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-linear-to-r ${accentClass} opacity-80`}
      />
      <CardHeader className="flex w-full items-start justify-between border-b border-white/10 px-4 pt-4 pb-2">
        <h3 className="text-base font-bold">{plan.name}</h3>
        {'activity' in plan && plan.activity ? (
          <span className="text-xs text-white/60">
            {isGameplan
              ? `vs ${plan.activity.title}`
              : `Linked to ${plan.activity.title}`}
          </span>
        ) : (
          ''
        )}
      </CardHeader>

      <div className="w-full flex-1 items-start gap-3 px-4 py-2 text-sm text-white/70">
        <div className="flex w-full flex-col items-start gap-1.5">
          <span className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-orange-300/80" />
            <h3 className="text-sm font-semibold">
              {'activity' in plan && plan.activity
                ? formatActivityDate(plan.activity.date)
                : 'No date set'}
            </h3>
          </span>
          <div className="flex items-center gap-1.5">
            <PlayIcon className="h-3.5 w-3.5 text-orange-300/80" />
            <span className="text-xs">{plan.plays.length} plays selected</span>
          </div>

          {isPractice && plan.focus && (
            <p className="line-clamp-1 text-xs text-white/55 italic">
              Focus: {plan.focus}
            </p>
          )}

          {isGameplan && plan.opponent && (
            <p className="line-clamp-1 text-xs text-white/55 italic">
              Opponent: {plan.opponent}
            </p>
          )}
          <div className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/70 px-2 py-2">
            {plan.plays.length > 0 ? (
              <div className="flex w-full items-center gap-1 overflow-hidden whitespace-nowrap">
                {visiblePlays.map((play) => (
                  <CategoryBadge
                    key={play.id}
                    label={play.name}
                    preserveCase
                    className="inline-flex max-w-[6.75rem] shrink-0 items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-white/10 bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white/90"
                  />
                ))}
                {hiddenPlayCount > 0 && (
                  <span className="inline-flex shrink-0 rounded-md border border-white/15 bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white/80">
                    +{hiddenPlayCount} more
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-white/50">No plays selected</span>
            )}
          </div>
        </div>
      </div>

      <CardFooter className="flex w-full justify-between px-4 pt-1 pb-4">
        <Link
          aria-label="View Plan Details"
          variant="light"
          size="sm"
          href={onView}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Link>
        {role === 'COACH' && (
          <Button
            variant="danger"
            aria-label="Delete Plan"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
