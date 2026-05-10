import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TileSource,
  resolveTile,
  newInstance,
} from '../../lib/library';
import SVGTileBase from '../common/SVGBase.component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Tile detail drawer shown from the /library page.
 */
const TileDetailDialog: React.FC<{
  tile: TileSource | null;
  onClose: () => void;
}> = ({ tile, onClose }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleOpenInEditor = () => {
    if (!tile) return;
    history.push(`/home?tile=${encodeURIComponent(tile.id)}`);
  };

  const resolved = tile ? resolveTile(tile, newInstance(tile)) : null;

  return (
    <Dialog
      open={tile !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        {tile && resolved && (
          <>
            <DialogHeader>
              <DialogTitle>{tile.displayName}</DialogTitle>
              <DialogDescription>
                <code className="text-xs">{tile.id}</code>
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[260px_1fr] gap-6">
              <div className="w-[260px] h-[260px] border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                <SVGTileBase
                  tile={resolved}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm self-start">
                <dt className="text-muted-foreground">
                  {t('library.detail.family')}
                </dt>
                <dd>{tile.family}</dd>
                <dt className="text-muted-foreground">
                  {t('library.detail.kind')}
                </dt>
                <dd className="uppercase text-xs tracking-wide">
                  {tile.kind}
                </dd>
                <dt className="text-muted-foreground">
                  {t('library.detail.source')}
                </dt>
                <dd>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      tile.source === 'user'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tile.source}
                  </span>
                </dd>
                <dt className="text-muted-foreground">
                  {t('library.detail.layers')}
                </dt>
                <dd>{Object.keys(tile.layers).length}</dd>
                {tile.grids && (
                  <>
                    <dt className="text-muted-foreground">
                      {t('library.detail.gridPatterns')}
                    </dt>
                    <dd>{tile.grids.length}</dd>
                  </>
                )}
                {tile.cornerUrl && (
                  <>
                    <dt className="text-muted-foreground">
                      {t('library.detail.cornerVariant')}
                    </dt>
                    <dd className="text-xs">
                      {t('library.detail.cornerVariantYes')}
                    </dd>
                  </>
                )}
              </dl>
            </div>

            <div className="mt-2">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                {t('library.detail.defaultPalette')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(tile.layers).map(([layerId, color]) => (
                  <div
                    key={layerId}
                    className="flex items-center gap-1.5 text-xs bg-gray-50 border rounded px-2 py-1"
                    title={`${layerId}: ${color}`}
                  >
                    <div
                      className="w-3 h-3 rounded-sm border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <code>{layerId}</code>
                    <span className="text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                {t('common.close')}
              </Button>
              <Button onClick={handleOpenInEditor}>
                {t('library.detail.openInEditor')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TileDetailDialog;
