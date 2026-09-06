'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/utils/tw-merge';

type TableProps = ComponentProps<'table'> & {
  containerClassName?: string;
};

const Table = ({ className, containerClassName, ...props }: TableProps) => {
  return (
    <div
      data-slot="table-container"
      className={cn('relative w-full overflow-x-auto', containerClassName)}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
};

export { Table };
