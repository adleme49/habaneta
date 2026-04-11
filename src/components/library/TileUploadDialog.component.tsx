import React, { useMemo, useState } from 'react';
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

/**
 * Dialog-driven SVG upload flow.
 *
 *   1. User picks an SVG file (file input or drop)
 *   2. parseSvgFile extracts the `st*` layers + default colors
 *   3. A TanStack Form collects displayName / family / kind
 *   4. Live preview on the right renders the parsed SVG
 *   5. Submit → construct TileSource + mutate → library query
 *      refreshes everywhere via invalidation
 */
const TileUploadDialog: React.FC = () => {
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
        // Keep the dialog open — the mutation's error state is
        // rendered in the footer below so the user can see what
        // went wrong (usually QuotaExceededError from IndexedDB).
        // No resetAndClose so their form input is preserved.
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
      // Pre-fill displayName from the filename if empty
      if (!form.state.values.displayName) {
        const base = file.name.replace(/\.svg$/i, '');
        form.setFieldValue('displayName', base);
      }
    } catch (e) {
      setParsed(null);
      setParseError(e instanceof Error ? e.message : String(e));
    }
  };

  // Build a ResolvedTile-shaped preview out of the parsed SVG
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
        <Button>Upload tile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload a tile</DialogTitle>
          <DialogDescription>
            Drop an SVG with <code>class="colora stN"</code> shapes. Layers
            will be auto-detected from the file.
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
              <Label htmlFor="svgfile">SVG file</Label>
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
                    <div>{Object.keys(parsed.layers).length} layers detected</div>
                  </div>
                ) : parseError ? (
                  <div className="text-center text-red-600 px-4">
                    {parseError}
                  </div>
                ) : (
                  <div className="text-center">
                    <div>Drop an SVG here, or click to browse</div>
                    <div className="text-[10px] mt-1">
                      Shapes must use <code>class="colora stN"</code>
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
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Floral pattern 1"
                    className="mt-1"
                  />
                </div>
              )}
            />

            <form.Field
              name="family"
              children={(field) => (
                <div>
                  <Label htmlFor={field.name}>Family</Label>
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
                  <Label htmlFor={field.name}>Kind</Label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(e.target.value as 'floor' | 'border')
                    }
                    className="mt-1 h-9 w-full border rounded-md border-input bg-transparent px-3 text-sm"
                  >
                    <option value="floor">Floor</option>
                    <option value="border">Border</option>
                  </select>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col items-center">
            <Label className="mb-2">Preview</Label>
            <div className="w-[200px] h-[200px] border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
              {previewTile ? (
                <SVGTileBase
                  tile={previewTile}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Pick a file to preview
                </span>
              )}
            </div>
          </div>

          {saveMutation.isError && (
            <div className="col-span-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              Save failed: {String(saveMutation.error)}
              {String(saveMutation.error).includes('Quota') && (
                <> — Try exporting and deleting older uploads first.</>
              )}
            </div>
          )}
          <DialogFooter className="col-span-2">
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!parsed || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save tile'}
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
