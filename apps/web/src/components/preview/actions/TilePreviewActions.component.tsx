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
  const {
    openModal,
    setGridImg,
    toggleOverlay,
    getCurrentDesign,
    setIsExporting: setStoreExporting,
  } = useStore();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  // Manual-fallback URL when the clipboard write is denied. Shown
  // in a persistent input (not auto-dismissed) so the user can
  // select-all + copy from it.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    text: string;
    kind: 'ok' | 'error';
  } | null>(null);

  const captureAndOpenEnviroment = async () => {
    if (isCapturing) return;
    const grid = document.getElementById('grid');
    if (!grid) return;
    setIsCapturing(true);
    toggleOverlay();
    // Same two-step as handleExport: flip the store flag so the
    // grids render every row plainly, wait for React to commit,
    // then snapshot. Without this, large virtualized grids would
    // hand the environment modal a cropped viewport image.
    setStoreExporting(true);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    try {
      const dataUrl = await domtoimage.toPng(grid);
      setGridImg(dataUrl);
      openModal('enviroment');
    } finally {
      setStoreExporting(false);
      toggleOverlay();
      setIsCapturing(false);
    }
  };

  const handleExport = async () => {
    const grid = document.getElementById('grid');
    if (!grid) return;
    setIsExporting(true);
    // Flip the store flag so SimpleGrid / DoubleGrid bypass the
    // row virtualizer and render every row into the DOM. The button
    // state (`isExporting` above) is local and drives the disabled /
    // "Exporting…" label; these two booleans are deliberately
    // independent — one is UI, one is render policy.
    setStoreExporting(true);
    setExportStatus(null);
    // Let React commit the un-virtualized grid into the DOM before
    // asking dom-to-image to walk it. Two rAFs is enough in
    // practice — the SVGs are already cached from the live preview.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
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
      setStoreExporting(false);
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
        <Button
          variant="outline"
          onClick={captureAndOpenEnviroment}
          disabled={isCapturing}
        >
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
