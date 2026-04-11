import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useLibraryQuery } from '../lib/queries';
import {
  TileSource,
  resolveTile,
  newInstance,
} from '../lib/library';
import SVGTileBase from '../components/common/SVGBase.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Tile library admin. Browsable read-only view of every TileSource in
 * the catalog. First step of the Input module — upload, edit and
 * delete land in subsequent commits, each gated on this Table view.
 */
const Library: React.FC = () => {
  const { data: library, isPending, isError, error } = useLibraryQuery();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<TileSource>[]>(
    () => [
      {
        id: 'preview',
        header: '',
        cell: ({ row }) => (
          <div className="w-10 h-10 overflow-hidden rounded">
            <SVGTileBase
              tile={resolveTile(row.original, newInstance(row.original))}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'displayName',
        header: 'Name',
      },
      {
        accessorKey: 'family',
        header: 'Family',
      },
      {
        accessorKey: 'kind',
        header: 'Kind',
        cell: ({ row }) => (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {row.original.kind}
          </span>
        ),
      },
      {
        id: 'layerCount',
        header: 'Layers',
        accessorFn: (row) => Object.keys(row.layers).length,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue() as number}</span>
        ),
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => (
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              row.original.source === 'user'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {row.original.source}
          </span>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => (
          <code className="text-xs text-muted-foreground">
            {getValue() as string}
          </code>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: library ?? [],
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg text-gray-700">Habaneta · Library</h1>
          <Link
            to="/home"
            className="text-sm text-blue-600 hover:underline"
          >
            ← back to editor
          </Link>
        </div>
        {library && (
          <span className="text-sm text-muted-foreground">
            {library.length} tiles
          </span>
        )}
      </header>

      <div className="p-6">
        {isPending && (
          <p className="text-sm text-muted-foreground">Loading catalog…</p>
        )}
        {isError && (
          <p className="text-sm text-red-600">
            Failed to load catalog: {String(error)}
          </p>
        )}
        {library && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search tiles…"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGlobalFilter('')}
                >
                  Clear
                </Button>
              )}
              <span className="text-sm text-muted-foreground ml-auto">
                {table.getFilteredRowModel().rows.length} of {library.length}
              </span>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort();
                        const sorted = header.column.getIsSorted();
                        return (
                          <TableHead key={header.id}>
                            {canSort ? (
                              <button
                                type="button"
                                className="flex items-center gap-1 hover:text-foreground"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                <span className="text-xs">
                                  {sorted === 'asc'
                                    ? '↑'
                                    : sorted === 'desc'
                                    ? '↓'
                                    : '↕'}
                                </span>
                              </button>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-sm text-muted-foreground py-8"
                      >
                        No tiles match the search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;
