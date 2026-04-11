import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useDeleteUserTileMutation, useLibraryQuery } from '../lib/queries';
import {
  TileSource,
  resolveTile,
  newInstance,
} from '../lib/library';
import SVGTileBase from '../components/common/SVGBase.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TileUploadDialog from '../components/library/TileUploadDialog.component';
import LibraryImportExport from '../components/library/LibraryImportExport.component';
import TileDetailDialog from '../components/library/TileDetailDialog.component';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Tile library admin. Browsable, sortable, filterable view of every
 * TileSource in the catalog. Clicking a row opens a detail drawer
 * (TileDetailDialog) — only the drawer's "Open in editor" button
 * actually navigates. That keeps the Library page a useful
 * inspection surface as well as a launchpad.
 */
type QuickFilter = 'all' | 'floor' | 'border' | 'user';

const Library: React.FC = () => {
  const { data: library, isPending, isError, error } = useLibraryQuery();
  const deleteMutation = useDeleteUserTileMutation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [detailTile, setDetailTile] = useState<TileSource | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" focuses the search input. Ignored when
  // the user is already typing in a form field, or when the detail
  // drawer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      if (detailTile !== null) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailTile]);

  const builtinCount = library?.filter((t) => t.source === 'builtin').length ?? 0;
  const userCount = library?.filter((t) => t.source === 'user').length ?? 0;
  const floorCount = library?.filter((t) => t.kind === 'floor').length ?? 0;
  const borderCount = library?.filter((t) => t.kind === 'border').length ?? 0;

  // Apply the quick filter BEFORE handing data to the table so it
  // composes cleanly with the global text search and column sorts.
  const filteredData = useMemo(() => {
    if (!library) return [];
    switch (quickFilter) {
      case 'floor':
        return library.filter((t) => t.kind === 'floor');
      case 'border':
        return library.filter((t) => t.kind === 'border');
      case 'user':
        return library.filter((t) => t.source === 'user');
      default:
        return library;
    }
  }, [library, quickFilter]);

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
      },
      { accessorKey: 'displayName', header: 'Name' },
      { accessorKey: 'family', header: 'Family' },
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
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <ActionsCell
            tile={row.original}
            confirmingId={confirmingDelete}
            onStartConfirm={setConfirmingDelete}
            onConfirm={(id) => {
              deleteMutation.mutate(id);
              setConfirmingDelete(null);
            }}
            onCancelConfirm={() => setConfirmingDelete(null)}
          />
        ),
      },
    ],
    [confirmingDelete, deleteMutation]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  const openDetail = (tile: TileSource) => setDetailTile(tile);

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
        <div className="flex items-center gap-3">
          {library && (
            <span className="text-sm text-muted-foreground">
              <span className="tabular-nums">{library.length}</span> tiles
              {userCount > 0 && (
                <span className="ml-2 text-xs">
                  ({builtinCount} builtin · {userCount} yours)
                </span>
              )}
            </span>
          )}
          <LibraryImportExport userTileCount={userCount} />
          <TileUploadDialog />
        </div>
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
            <div className="flex items-center gap-1.5 mb-3">
              <FilterPill
                active={quickFilter === 'all'}
                onClick={() => setQuickFilter('all')}
                label="All"
                count={library.length}
              />
              <FilterPill
                active={quickFilter === 'floor'}
                onClick={() => setQuickFilter('floor')}
                label="Floors"
                count={floorCount}
              />
              <FilterPill
                active={quickFilter === 'border'}
                onClick={() => setQuickFilter('border')}
                label="Borders"
                count={borderCount}
              />
              <FilterPill
                active={quickFilter === 'user'}
                onClick={() => setQuickFilter('user')}
                label="Mine"
                count={userCount}
                disabled={userCount === 0}
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Input
                ref={searchInputRef}
                placeholder="Search tiles…  (press / to focus)"
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
                      <TableRow
                        key={row.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={(e) => {
                          // Don't hijack clicks on the action
                          // column buttons.
                          const target = e.target as HTMLElement;
                          if (target.closest('button')) return;
                          openDetail(row.original);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openDetail(row.original);
                          }
                        }}
                      >
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

      <TileDetailDialog
        tile={detailTile}
        onClose={() => setDetailTile(null)}
      />
    </div>
  );
};

const FilterPill: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, count, active, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
      active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-background hover:bg-accent border-border text-foreground'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    {label}
    <span className="ml-1.5 tabular-nums opacity-80">{count}</span>
  </button>
);

/**
 * Per-row Delete action with inline Confirm/Cancel.
 */
const ActionsCell: React.FC<{
  tile: TileSource;
  confirmingId: string | null;
  onStartConfirm: (id: string) => void;
  onConfirm: (id: string) => void;
  onCancelConfirm: () => void;
}> = ({ tile, confirmingId, onStartConfirm, onConfirm, onCancelConfirm }) => {
  if (tile.source !== 'user') return null;
  const isConfirming = confirmingId === tile.id;
  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onConfirm(tile.id)}
        >
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancelConfirm}>
          Cancel
        </Button>
      </div>
    );
  }
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={() => onStartConfirm(tile.id)}
    >
      Delete
    </Button>
  );
};

export default Library;
