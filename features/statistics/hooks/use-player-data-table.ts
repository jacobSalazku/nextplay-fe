'use client';
'use no memo';

import { useState } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

export function usePlayerDataTable<TData, TValue>(
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table v8 uses interior mutability incompatible with React Compiler.
  // eslint-disable-next-line react-hooks/incompatible-library -- opt out via 'use no memo'
  return useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
}
