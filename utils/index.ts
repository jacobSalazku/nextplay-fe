import { Trophy, Users } from 'lucide-react';
import { ActivityType } from '@/graphql/graphql';

export function getTypeBgColor(type: ActivityType): string {
  switch (type) {
    case ActivityType.Game:
      return 'bg-indigo-300 text-indigo-900';
    case ActivityType.Practice:
      return 'bg-green-300 text-green-900';
    case ActivityType.Meeting:
      return 'bg-amber-300 text-amber-900';
    case ActivityType.Film:
      return 'bg-fuchsia-300 text-fuchsia-900';
    case ActivityType.Feedback:
      return 'bg-cyan-300 text-cyan-900';
    default:
      return 'bg-slate-200 text-slate-900';
  }
}

export function getActivityStyle(type: ActivityType) {
  switch (type) {
    case ActivityType.Game:
      return {
        bgColor: 'bg-yellow-900/70',
        textColor: 'text-yellow-200',
        Icon: Trophy,
      };
    case ActivityType.Practice:
      return {
        bgColor: 'bg-blue-900/70',
        textColor: 'text-blue-200',
        Icon: Users,
      };
    case ActivityType.Meeting:
      return {
        bgColor: 'bg-amber-900/70',
        textColor: 'text-amber-200',
        Icon: Users,
      };
    case ActivityType.Film:
      return {
        bgColor: 'bg-fuchsia-900/70',
        textColor: 'text-fuchsia-200',
        Icon: Users,
      };
    case ActivityType.Feedback:
      return {
        bgColor: 'bg-cyan-900/70',
        textColor: 'text-cyan-200',
        Icon: Users,
      };
    default:
      return {
        bgColor: 'bg-gray-900/70',
        textColor: 'text-gray-200',
        Icon: Users,
      };
  }
}
