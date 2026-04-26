'use client';

import { Trophy, Users } from 'lucide-react';
import { Button } from '@/components/foundation/button/button';

type ActivityType = 'all' | 'game' | 'practice';

interface ActivityFilterProps {
  currentFilter: ActivityType;
  onFilterChange: (filter: ActivityType) => void;
}

export function ActivityFilter({
  currentFilter,
  onFilterChange,
}: ActivityFilterProps) {
  return (
    <div className="flex w-full overflow-hidden rounded-lg border border-gray-700 sm:w-auto">
      {['all', 'game', 'practice'].map((type) => (
        <Button
          key={type}
          variant={currentFilter === type ? 'outline' : 'default'}
          size="sm"
          onClick={() => onFilterChange(type as ActivityType)}
          className="w-full rounded-none border-orange-300/20 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-900 hover:text-orange-300"
        >
          {type === 'game' && <Trophy className="mr-1 h-4 w-4" />}
          {type === 'practice' && <Users className="mr-1 h-4 w-4" />}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </div>
  );
}
