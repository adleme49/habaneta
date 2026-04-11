import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@tanstack/react-form';
import { parseSvgFile, ParsedSvg } from '../../lib/svg-parse';
import { TileSource, resolveTile, newInstance } from '../../lib/library';
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

const TileUploadDialog: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedSvg | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const saveMutation = useSaveUserTileMutation();

  const form = useForm({
    defaultValues: {
      displayName: '',
      family: 'My Uploads',
      kind: 'floor' as 'floor' | 'border',
    },
    onSubmit: async ({ value }) => {
      if (!parsed) return;
      const id = `user/${slugify(value.displayName)}-${Date.now()}`;
      const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(parsed.svgText)}`;
      const tile: TileSource = {
        id,
        kind: value.kind,
        family: value.family.trim() || 'My Uploads',
        displayName: value.displayName.trim() || 'Untitled',
        svgUrl: svgDataUrl,
        layers: parsed.layers,
        source: 'user',
      };
      try {
        await saveMutation.mutateAsync(tile);
        resetAndClose();
      } catch {
        // Keep the dialog open — error banner below surfaces the cause.
      }
    },
  });

  const resetAndClose = () => {
    form.reset();
    setParsed(null);
    setParseError(null);
    setFileName('');
    setOpen(false);
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setParseError(null);
    try {
      const result = await parseSvgFile(file);
      setParsed(result);
      if (!form.state.values.displayName) {
        const base = file.name.replace(/\.svg$/i, '');
        form.setFieldValue('displayName', base);
      }
    } catch (e) {
      setParsed(null);
      setParseError(e instanceof Error ? e.message : String(e));
    }
  };

  const previewTile = useMemo(() => {
    if (!parsed) return null;
    const previewSource: TileSource = {
      id: 'preview',
      kind: form.state.values.kind,
      family: '',
      displayName: '',
      svgUrl: `data:image/svg+xml;utf8,${encodeURIComponent(parsed.svgText)}`,
      layers: parsed.layers,
      source: 'user',
    };
    return resolveTile(previewSource, newInstance(previewSource));
  }, [parsed, form.state.values.kind]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button>{t('library.upload.trigger')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('library.upload.title')}</DialogTitle>
          <DialogDescription>
            {t('library.upload.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid grid-cols-[1fr_200px] gap-4"
        >
          <div className="space-y-3">
            <div>
              <Label htmlFor="svgfile">{t('library.upload.svgFile')}</Label>
              <label
                htmlFor="svgfile"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className={`mt-1 flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed text-xs text-muted-foreground transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5 text-primary'
                    : parseError
                    ? 'border-red-300 bg-red-50'
                    : parsed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {parsed && !parseError ? (
                  <div className="text-center">
                    <div className="text-green-700 font-medium">
                      {fileName}
                    </div>
                    <div>
                      {t('library.upload.layersDetected', {
                        count: Object.keys(parsed.layers).length,
                      })}
                    </div>
                  </div>
                ) : parseError ? (
                  <div className="text-center text-red-600 px-4">
                    {parseError}
                  </div>
                ) : (
                  <div className="text-center">
                    <div>{t('library.upload.pickFilePrompt')}</div>
                    <div className="text-[10px] mt-1">
                      {t('library.upload.classHint')}
                    </div>
                  </div>
                )}
              </label>
              <input
                id="svgfile"
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            <form.Field
              name="displayName"
              children={(field) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t('library.upload.name')}
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={t('library.upload.namePlaceholder')}
                    className="mt-1"
                  />
                </div>
              )}
            />

            <form.Field
              name="family"
              children={(field) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t('library.upload.family')}
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="mt-1"
                  />
                </div>
              )}
            />

            <form.Field
              name="kind"
              children={(field) => (
                <div>
                  <Label htmlFor={field.name}>
                    {t('library.upload.kind')}
                  </Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as 'floor' | 'border')
                    }
                    className="mt-1 h-9 w-full border rounded-md border-input bg-transparent px-3 text-sm"
                  >
                    <option value="floor">{t('library.upload.kindFloor')}</option>
                    <option value="border">{t('library.upload.kindBorder')}</option>
                  </select>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col items-center">
            <Label className="mb-2">{t('library.upload.preview')}</Label>
            <div className="w-[200px] h-[200px] border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
              {previewTile ? (
                <SVGTileBase
                  tile={previewTile}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t('library.upload.previewEmpty')}
                </span>
              )}
            </div>
          </div>

          {saveMutation.isError && (
            <div className="col-span-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {t('library.upload.saveFailed', {
                error: String(saveMutation.error),
              })}
              {String(saveMutation.error).includes('Quota') && (
                <> — {t('library.upload.quotaHint')}</>
              )}
            </div>
          )}
          <DialogFooter className="col-span-2">
            <Button type="button" variant="outline" onClick={resetAndClose}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!parsed || saveMutation.isPending}
            >
              {saveMutation.isPending
                ? t('library.upload.saving')
                : t('library.upload.saveTile')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'tile';
}

export default TileUploadDialog;
