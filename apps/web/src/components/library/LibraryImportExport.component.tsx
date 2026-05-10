import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  exportUserTiles,
  importUserTiles,
  ImportResult,
} from '../../lib/import-export';
import { queryKeys } from '../../lib/queries';
import { Button } from '@/components/ui/button';

const LibraryImportExport: React.FC<{ userTileCount: number }> = ({
  userTileCount,
}) => {
  const { t } = useTranslation();
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
      show(
        count === 1
          ? t('library.importExport.exported', { count })
          : t('library.importExport.exportedPlural', { count })
      );
    } catch (err) {
      show(
        t('library.importExport.exportFailed', {
          error: err instanceof Error ? err.message : String(err),
        }),
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
      let message = t('library.importExport.imported', { count: result.added });
      if (result.skipped > 0) {
        message += t('library.importExport.skipped', { count: result.skipped });
      }
      if (result.errors.length > 0) {
        message += t('library.importExport.errors', {
          count: result.errors.length,
        });
      }
      show(message, result.errors.length > 0);
    } catch (err) {
      show(
        t('library.importExport.importFailed', {
          error: err instanceof Error ? err.message : String(err),
        }),
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
        {t('library.importExport.export')}
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        {t('library.importExport.import')}
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
