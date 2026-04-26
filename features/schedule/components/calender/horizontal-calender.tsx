'use client';

import { useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { addDays, format, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/helpers/utils';
import { GetTeamActivitiesQuery, Team } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { CalendarDay } from './calendar-day';

type HorizontalCalendarProps = {
  activities: GetTeamActivitiesQuery['getTeamActivities']['activities'];
  team: Team;
};

export function HorizontalCalender({ activities }: HorizontalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();

  const visibleDays = useMemo(() => {
    const offset = isMobile ? 1 : 2;
    const length = isMobile ? 3 : 5;
    return Array.from({ length }, (_, i) =>
      addDays(subDays(currentDate, offset), i),
    );
  }, [currentDate, isMobile]);

  const handlePrevious = () =>
    setCurrentDate((prevDate) => subDays(prevDate, isMobile ? 3 : 5));
  const handleNext = () =>
    setCurrentDate((prevDate) => addDays(prevDate, isMobile ? 3 : 5));

  return (
    <div className="max-h-full min-h-60 w-full rounded-xl border border-orange-200/30 p-3 shadow-2xl transition-colors duration-300 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-gray-100">
          {format(visibleDays[0] ?? new Date(), 'MMM d')} -{' '}
          {format(
            visibleDays[visibleDays.length - 1] ?? new Date(),
            'MMM d, yyyy',
          )}
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={handlePrevious}
            className="rounded p-1 text-orange-300 shadow-md transition-colors duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            onClick={handleNext}
            className="rounded p-1 text-orange-300 shadow-md transition-colors duration-200"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'grid max-h-4/5 gap-1',
          isMobile ? 'grid-cols-3' : 'grid-cols-5',
        )}
      >
        {visibleDays.map((day, index) => (
          <CalendarDay key={index} day={day} activities={activities} />
        ))}
      </div>
    </div>
  );
}
