import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  exportUserTiles,
  importUserTiles,
  ImportResult,
} from '../../lib/import-export';
import { queryKeys } from '../../lib/queries';
import { Button } from '@/components/ui/button';

/**
 * Import / export buttons for the user-tile collection. Shown in
 * the /library page header next to the Upload button.
 *
 *   Export → downloads a JSON file of just the user tiles
 *   Import → file picker → parses, dedupes, merges into IndexedDB,
 *            invalidates the library query so the table + editor
 *            pick up the new rows automatically
 *
 * Import result is surfaced inline next to the buttons.
 */
const LibraryImportExport: React.FC<{ userTileCount: number }> = ({
  userTileCount,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const show = (message: string, error = false) => {
    setStatus(message);
    setIsError(error);
    window.setTimeout(() => setStatus(null), 4000);
  };

  const handleExport = async () => {
    try {
      const count = await exportUserTiles();
      show(`Exported ${count} tile${count === 1 ? '' : 's'}`);
    } catch (err) {
      show(
        `Export failed: ${err instanceof Error ? err.message : String(err)}`,
        true
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    try {
      const result: ImportResult = await importUserTiles(file);
      await queryClient.invalidateQueries({ queryKey: queryKeys.library });
      const parts = [`Imported ${result.added}`];
      if (result.skipped > 0) parts.push(`skipped ${result.skipped}`);
      if (result.errors.length > 0) parts.push(`${result.errors.length} errors`);
      show(parts.join(', '), result.errors.length > 0);
    } catch (err) {
      show(
        `Import failed: ${err instanceof Error ? err.message : String(err)}`,
        true
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={userTileCount === 0}
      >
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileSelected}
      />
      {status && (
        <span
          className={`text-xs ${isError ? 'text-red-600' : 'text-green-700'}`}
        >
          {status}
        </span>
      )}
    </div>
  );
};

export default LibraryImportExport;
