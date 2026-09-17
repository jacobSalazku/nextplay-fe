import { Dribbble, Shield, Target } from 'lucide-react';

export const categoriesFilter = [
  {
    id: 'offense',
    label: 'Offense',
    icon: Dribbble,
    gradient: 'bg-gradient-to-bl from-orange-500 to-orange-950',
    border: 'border-orange-800/30',
    count: 12,
  },
  {
    id: 'defense',
    label: 'Defense',
    icon: Shield,
    gradient: 'bg-gradient-to-bl from-blue-500 to-blue-950',
    border: 'border-blue-800/30',
    count: 8,
  },

  {
    id: 'special',
    label: 'Special',
    icon: Target,
    gradient: 'bg-gradient-to-bl from-purple-500 to-purple-950',
    border: 'border-purple-800/30',
    count: 3,
  },
];
