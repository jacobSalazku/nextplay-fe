import { cn } from '@/utils/tw-merge';

type CategoryBadgeProps = {
  className?: string;
  label: string;
};

export const CategoryBadge = ({ className, label }: CategoryBadgeProps) => {
  const capitalizedLabel =
    label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return (
    <span className={cn(className, 'rounded-2xl px-4 py-1 text-sm font-light')}>
      {capitalizedLabel}
    </span>
  );
};
