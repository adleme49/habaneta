import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  importImageAsTile,
  ImportResult,
  Symmetry,
} from '../../lib/image-import';
import { TileSource, resolveTile, newInstance } from '../../lib/library';
import { slugify } from '../../lib/utils';
import { useSaveUserTileMutation } from '../../lib/queries';
import SVGTileBase from '../common/SVGBase.component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MIN_LAYERS = 2;
const MAX_LAYERS = 10;
const DEFAULT_LAYERS = 5;
/** Delay before auto-re-analyzing after parameter changes. */
const LIVE_PREVIEW_DEBOUNCE_MS = 400;
/** Show a "reduce layers" hint when any two centroids are closer than this (OKLAB). */
const SIMILAR_COLOR_THRESHOLD = 0.04;

const ImageImportDialog: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [layerCount, setLayerCount] = useState(DEFAULT_LAYERS);
  const [symmetry, setSymmetry] = useState<Symmetry>('none');
  const [autoCrop, setAutoCrop] = useState(true);
  // Default OFF: auto-levels distorts limited-palette tiles (scans,
  // renders, clean graphics). Opt-in for dim/washed photos.
  const [autoLevels, setAutoLevels] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [family, setFamily] = useState('My Imports');
  const saveMutation = useSaveUserTileMutation();
  // Monotonic id: discard completed runs that no longer match the latest
  // request, so stale results don't overwrite newer ones when the user
  // scrubs parameters quickly.
  const requestId = useRef(0);

  const resetAndClose = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setFile(null);
    setImagePreviewUrl(null);
    setResult(null);
    setError(null);
    setDisplayName('');
    setFamily('My Imports');
    setLayerCount(DEFAULT_LAYERS);
    setSymmetry('none');
    setAutoCrop(true);
    setAutoLevels(false);
    setProcessing(false);
    setOpen(false);
  };

  const handleFile = (f: File) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setFile(f);
    setImagePreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
    if (!displayName) {
      setDisplayName(f.name.replace(/\.(png|jpe?g|webp|bmp|gif)$/i, ''));
    }
  };

  const processImage = async () => {
    if (!file) return;
    const id = ++requestId.current;
    setProcessing(true);
    setError(null);
    try {
      const res = await importImageAsTile(file, {
        layerCount,
        symmetry,
        autoCrop,
        autoLevels,
      });
      // Drop the result if a newer request has started meanwhile.
      if (id !== requestId.current) return;
      setResult(res);
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (id === requestId.current) setProcessing(false);
    }
  };

  // Debounced live preview: re-analyze whenever the file or parameters
  // change. Keeps the explicit "Analyze" button available for re-rolling
  // the stochastic k-means.
  useEffect(() => {
    if (!file) return;
    const t = setTimeout(() => {
      processImage();
    }, LIVE_PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // processImage is defined inline and captures current state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, layerCount, symmetry, autoCrop, autoLevels]);

  const handleSave = async () => {
    if (!result) return;
    const id = `user/${slugify(displayName || 'imported')}-${Date.now()}`;
    const tile: TileSource = {
      id,
      // Hardcoded to floor — photos of real tiles are almost always
      // floor tiles. A kind selector can be added later if needed.
      kind: 'floor',
      family: family.trim() || 'My Imports',
      displayName: displayName.trim() || 'Imported tile',
      svgUrl: result.svgDataUrl,
      layers: result.layers,
      source: 'user',
    };
    try {
      await saveMutation.mutateAsync(tile);
      resetAndClose();
    } catch {
      // Error banner shown via mutation state below.
    }
  };

  // Build a ResolvedTile from the import result for the preview.
  const previewTile = useMemo(() => {
    if (!result) return null;
    const source: TileSource = {
      id: 'import-preview',
      kind: 'floor',
      family: '',
      displayName: '',
      svgUrl: result.svgDataUrl,
      layers: result.layers,
      source: 'user',
    };
    return resolveTile(source, newInstance(source));
  }, [result]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">{t('library.imageImport.trigger')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('library.imageImport.title')}</DialogTitle>
          <DialogDescription>
            {t('library.imageImport.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_200px] gap-4">
          {/* Left column: controls */}
          <div className="space-y-3">
            {/* File picker */}
            <div>
              <Label htmlFor="image-import-file">
                {t('library.imageImport.imageFile')}
              </Label>
              <input
                id="image-import-file"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
                className="mt-1 block w-full text-sm file:mr-4 file:rounded file:border file:border-input file:bg-transparent file:px-3 file:py-1 file:text-sm file:cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Layer count slider */}
            <div>
              <Label htmlFor="image-import-layers">
                {t('library.imageImport.layers')}: {layerCount}
              </Label>
              <input
                id="image-import-layers"
                type="range"
                min={MIN_LAYERS}
                max={MAX_LAYERS}
                value={layerCount}
                onChange={(e) => setLayerCount(Number(e.target.value))}
                className="mt-1 w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{MIN_LAYERS}</span>
                <span>{MAX_LAYERS}</span>
              </div>
            </div>

            {/* Symmetry selector */}
            <div>
              <Label htmlFor="image-import-symmetry">
                {t('library.imageImport.symmetry')}
              </Label>
              <select
                id="image-import-symmetry"
                value={symmetry}
                onChange={(e) => setSymmetry(e.target.value as Symmetry)}
                className="mt-1 block w-full rounded border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="none">{t('library.imageImport.symmetryNone')}</option>
                <option value="2fold">{t('library.imageImport.symmetry2fold')}</option>
                <option value="4fold">{t('library.imageImport.symmetry4fold')}</option>
              </select>
            </div>

            {/* Preprocessing toggles */}
            <div className="flex flex-col gap-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoCrop}
                  onChange={(e) => setAutoCrop(e.target.checked)}
                />
                <span>{t('library.imageImport.autoCrop')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoLevels}
                  onChange={(e) => setAutoLevels(e.target.checked)}
                />
                <span>{t('library.imageImport.autoLevels')}</span>
              </label>
            </div>

            {/* Process button */}
            <Button
              onClick={processImage}
              disabled={!file || processing}
              className="w-full"
            >
              {processing
                ? t('library.imageImport.processing')
                : t('library.imageImport.analyze')}
            </Button>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            {/* Name + family (shown after processing) */}
            {result && (
              <>
                <div>
                  <Label>{t('library.upload.name')}</Label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('library.upload.namePlaceholder')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{t('library.upload.family')}</Label>
                  <Input
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('library.imageImport.layersDetected', {
                    count: Object.keys(result.layers).length,
                  })}
                  <div className="flex items-center gap-1 mt-1">
                    {Object.values(result.layers).map((hex, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded border border-gray-200 inline-block"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  {result.minCentroidDistance < SIMILAR_COLOR_THRESHOLD &&
                    layerCount > MIN_LAYERS && (
                      <div className="text-[11px] text-amber-700 mt-1">
                        {t('library.imageImport.similarColorsHint')}
                      </div>
                    )}
                </div>
              </>
            )}
          </div>

          {/* Right column: preview */}
          <div className="flex flex-col items-center gap-2">
            {imagePreviewUrl && (
              <div>
                <Label className="mb-1 block text-center">
                  {t('library.imageImport.original')}
                </Label>
                <img
                  src={imagePreviewUrl}
                  alt="Original"
                  className="w-[200px] h-[200px] object-cover border rounded-md"
                />
              </div>
            )}
            {previewTile && (
              <div>
                <Label className="mb-1 block text-center">
                  {t('library.imageImport.result')}
                </Label>
                <div className="w-[200px] h-[200px] border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  <SVGTileBase
                    tile={previewTile}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            )}
            {!imagePreviewUrl && !previewTile && (
              <div className="w-[200px] h-[200px] border rounded-md bg-gray-50 flex items-center justify-center text-xs text-muted-foreground">
                {t('library.imageImport.pickPrompt')}
              </div>
            )}
          </div>
        </div>

        {saveMutation.isError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {t('library.upload.saveFailed', {
              error: String(saveMutation.error),
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!result || saveMutation.isPending}
          >
            {saveMutation.isPending
              ? t('library.upload.saving')
              : t('library.imageImport.saveTile')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageImportDialog;
