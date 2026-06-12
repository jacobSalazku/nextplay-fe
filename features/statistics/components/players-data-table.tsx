'use client';

import { usePlayerDataTable } from '@/features/statistics/hooks/use-player-data-table';
import { cn } from '@/utils/tw-merge';
import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoveDown, MoveUp } from 'lucide-react';
import { Table } from '@/components/foundation/table/table';
import { TableBody } from '@/components/foundation/table/table-body';
import { TableCell } from '@/components/foundation/table/table-cell';
import { TableHead } from '@/components/foundation/table/table-head';
import { TableHeader } from '@/components/foundation/table/table-header';
import { TableRow } from '@/components/foundation/table/table-row';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function PlayerAverageDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  'use no memo';

  const table = usePlayerDataTable(data, columns);

  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-orange-500/20 bg-gray-950/95 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
      <Table className="scrollbar-none overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-gray-800 bg-gray-900/75 p-2"
            >
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();

                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      isSortable ? 'cursor-pointer select-none' : '',
                      'cursor-pointer p-3 text-xs font-bold tracking-[0.12em] text-orange-100/90 uppercase hover:bg-gray-800/30',
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sortDirection === 'asc' ? (
                        <MoveUp className="h-3 w-2 text-orange-300" />
                      ) : sortDirection === 'desc' ? (
                        <MoveDown className="h-3 w-2 text-orange-300" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-orange-100/70" />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn(
                  'border-gray-800 transition-colors hover:bg-orange-500/8',
                  index % 2 === 0 ? 'bg-gray-950/85' : 'bg-gray-900/45',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-3 py-2.5 text-sm text-gray-100"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-4 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
