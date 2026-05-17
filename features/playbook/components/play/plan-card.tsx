import type { UrlObject } from 'url';
import type { PlanCardType } from '../../utils/types';
import { Calendar, Eye, PlayIcon, Trash2 } from 'lucide-react';
import { GamePlan, PracticePreparation } from '@/graphql/graphql';
import { Card, CardFooter, CardHeader } from '@/components/card';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';
import { CategoryBadge } from '@/components/foundation/category-badge';

type PlanCardProps = {
  plan: GamePlan | PracticePreparation;
  type: PlanCardType;
  onView: string | UrlObject;
  onDelete: (plan: GamePlan | PracticePreparation) => void;
  role: string;
};

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

  return (
    <Card className="group relative flex h-full flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/95 to-slate-950 text-sm text-white shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-orange-300/50">
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-linear-to-r ${accentClass} opacity-80`}
      />
      <CardHeader className="flex w-full items-start justify-between border-b border-white/10 px-4 pt-5 pb-3">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        {'activity' in plan && plan.activity ? (
          <span className="text-white/60">
            {isGameplan
              ? `vs ${plan.activity.title}`
              : `Linked to ${plan.activity.title}`}
          </span>
        ) : (
          ''
        )}
      </CardHeader>

      <div className="w-full flex-1 items-start gap-3 px-4 py-3 text-sm text-white/70">
        <div className="flex w-full flex-col items-start gap-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-300/80" />
            <h3 className="font-bold">
              {'activity' in plan && plan.activity
                ? formatActivityDate(plan.activity.date)
                : 'No date set'}
            </h3>
          </span>
          <div className="flex items-center gap-2">
            <PlayIcon className="h-4 w-4 text-orange-300/80" />
            <span>{plan.plays.length} plays selected</span>
          </div>

          {isPractice && plan.focus && (
            <p className="text-xs text-white/55 italic">Focus: {plan.focus}</p>
          )}

          {isGameplan && plan.opponent && (
            <p className="text-xs text-white/55 italic">
              Opponent: {plan.opponent}
            </p>
          )}

          <div className="mt-2 w-full space-x-1 rounded-xl border border-white/10 bg-slate-900/80 px-2 py-3">
            {plan.plays.length > 0 ? (
              plan.plays
                .slice(0, 3)
                .map((play) => (
                  <CategoryBadge
                    key={play.id}
                    label={play.name}
                    className="border border-white/10 bg-slate-900/60 p-1 text-xs text-white"
                  />
                ))
            ) : (
              <span className="text-white/50">No plays selected</span>
            )}
          </div>
        </div>
      </div>

      <CardFooter className="flex w-full justify-between px-4 pt-2 pb-5">
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
            onClick={() => onDelete(plan)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
