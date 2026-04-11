import React from 'react';
import { useHistory } from 'react-router-dom';
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
 * Tile detail drawer shown from the /library page. Lets the user
 * inspect a tile's metadata + full-size preview + layer list
 * without committing to "open in editor" as the only interaction.
 *
 * Controlled: parent Library page owns the `tile` state and clears
 * it (→ dialog closes) on close.
 */
const TileDetailDialog: React.FC<{
  tile: TileSource | null;
  onClose: () => void;
}> = ({ tile, onClose }) => {
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
                <dt className="text-muted-foreground">Family</dt>
                <dd>{tile.family}</dd>
                <dt className="text-muted-foreground">Kind</dt>
                <dd className="uppercase text-xs tracking-wide">
                  {tile.kind}
                </dd>
                <dt className="text-muted-foreground">Source</dt>
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
                <dt className="text-muted-foreground">Layers</dt>
                <dd>{Object.keys(tile.layers).length}</dd>
                {tile.grids && (
                  <>
                    <dt className="text-muted-foreground">Grid patterns</dt>
                    <dd>{tile.grids.length}</dd>
                  </>
                )}
                {tile.cornerUrl && (
                  <>
                    <dt className="text-muted-foreground">Corner variant</dt>
                    <dd className="text-xs">yes</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="mt-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Default palette
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
                Close
              </Button>
              <Button onClick={handleOpenInEditor}>Open in editor</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TileDetailDialog;
