import { cn } from '@/utils/tw-merge';

type CategoryBadgeProps = {
  className?: string;
  label: string;
  preserveCase?: boolean;
};

export const CategoryBadge = ({
  className,
  label,
  preserveCase = false,
}: CategoryBadgeProps) => {
  const formattedLabel = preserveCase
    ? label
    : label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return (
    <span
      className={cn('rounded-2xl px-3 py-0.5 text-xs font-light', className)}
    >
      {formattedLabel}
    </span>
  );
};
