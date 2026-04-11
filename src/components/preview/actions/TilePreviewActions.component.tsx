import domtoimage from 'dom-to-image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore, DEFAULT_BODY_ROWS } from '../../../store/store';
import { buildShareUrl } from '../../../lib/design-url';
import {
  exportDesignAsPng,
  buildExportFilename,
} from '../../../lib/design-export';
import { DEFAULT_AMBIENT_ID } from '../../../lib/ambients';
import { Button } from '@/components/ui/button';

const TilePreviewActions: React.FC = () => {
  const { t } = useTranslation();
  const { openModal, setGridImg, toggleOverlay, getCurrentDesign } = useStore();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  // Manual-fallback URL when the clipboard write is denied. Shown
  // in a persistent input (not auto-dismissed) so the user can
  // select-all + copy from it.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    text: string;
    kind: 'ok' | 'error';
  } | null>(null);

  const captureAndOpenEnviroment = () => {
    toggleOverlay();
    const grid = document.getElementById('grid');
    if (grid) {
      domtoimage.toPng(grid).then((dataUrl) => {
        setGridImg(dataUrl);
        toggleOverlay();
        openModal('enviroment');
      });
    }
  };

  const handleExport = async () => {
    const grid = document.getElementById('grid');
    if (!grid) return;
    setIsExporting(true);
    setExportStatus(null);
    try {
      await exportDesignAsPng(grid, buildExportFilename());
      setExportStatus({ text: t('preview.exported'), kind: 'ok' });
      window.setTimeout(() => setExportStatus(null), 3000);
    } catch (e) {
      setExportStatus({
        text: t('preview.exportFailed', {
          error: e instanceof Error ? e.message : String(e),
        }),
        kind: 'error',
      });
      window.setTimeout(() => setExportStatus(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = buildShareUrl(getCurrentDesign(), {
      gridBodyRows: DEFAULT_BODY_ROWS,
      selectedAmbientId: DEFAULT_AMBIENT_ID,
    });
    try {
      await navigator.clipboard.writeText(url);
      setFallbackUrl(null);
      setShareStatus(t('preview.linkCopied'));
      window.setTimeout(() => setShareStatus(null), 3000);
    } catch {
      // Clipboard API denied (permissions, insecure context, etc.)
      // — show the URL in a persistent readonly input so the user
      // can manually copy it instead of auto-dismissing.
      setShareStatus(null);
      setFallbackUrl(url);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => openModal('gallery')}>
          {t('preview.gallery')}
        </Button>
        <Button variant="outline" onClick={captureAndOpenEnviroment}>
          {t('preview.environment')}
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? t('preview.exporting') : t('preview.export')}
        </Button>
        <Button onClick={handleShare}>{t('preview.share')}</Button>
        {shareStatus && (
          <span
            className="text-xs text-green-700"
            aria-live="polite"
          >
            {shareStatus}
          </span>
        )}
        {exportStatus && (
          <span
            className={`text-xs ${
              exportStatus.kind === 'error' ? 'text-red-600' : 'text-green-700'
            }`}
            aria-live="polite"
          >
            {exportStatus.text}
          </span>
        )}
      </div>
      {fallbackUrl && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground flex-shrink-0">
            {t('preview.shareFallback')}
          </span>
          <input
            type="text"
            readOnly
            value={fallbackUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 min-w-0 border rounded px-2 py-1 font-mono"
          />
          <button
            type="button"
            onClick={() => setFallbackUrl(null)}
            aria-label={t('common.close')}
            className="text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TilePreviewActions;
