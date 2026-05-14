'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/utils/tw-merge';

const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
};

export { TableRow };
