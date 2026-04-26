import { Trophy, Users } from 'lucide-react';
import { ActivityType } from '@/graphql/graphql';

export function getTypeBgColor(type: ActivityType): string {
  switch (type.toLowerCase()) {
    case ActivityType.Game:
      return 'bg-indigo-300 text-indigo-800';
    case ActivityType.Practice:
      return 'bg-green-300 text-green-700';
    case 'other':
      return 'bg-red-200 text-red-950';
    default:
      return 'bg-slate-200 text-slate-950';
  }
}

export function getActivityStyle(type: string) {
  switch (type) {
    case 'Game':
      return {
        bgColor: 'bg-yellow-900',
        textColor: 'text-yellow-300',
        Icon: Trophy,
      };
    case 'Practice':
      return {
        bgColor: 'bg-blue-900',
        textColor: 'text-blue-300',
        Icon: Users,
      };
    default:
      return {
        bgColor: 'bg-gray-900',
        textColor: 'text-gray-300',
        Icon: Users,
      };
  }
}
