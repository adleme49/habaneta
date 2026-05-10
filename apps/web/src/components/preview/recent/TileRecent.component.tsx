import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import { findSource, TileInstance } from '../../../lib/library';
import TileRecentItem from './TileRecentItem.component';

/**
 * Recent slots strip, simplified from the old fixed 7-box grid:
 *  - Only occupied slots are rendered (no empty placeholders).
 *  - Slots are visually grouped into Floors / Borders sub-clusters
 *    with a thin divider, so role is obvious without labels.
 *  - An empty state replaces the whole row when nothing has been
 *    saved yet.
 */
const TileRecent: React.FC = () => {
  const { t } = useTranslation();
  const { recent, library } = useStore();

  // Split non-null slots by kind, preserving original array indices
  // (the store's reducer identifies slots by index, so we can't
  // reindex after filtering).
  const { floors, borders } = useMemo(() => {
    const f: Array<{ instance: TileInstance; index: number }> = [];
    const b: Array<{ instance: TileInstance; index: number }> = [];
    recent.forEach((slot, index) => {
      if (!slot) return;
      const src = findSource(library, slot.sourceId);
      if (!src) return;
      const entry = { instance: slot, index };
      if (src.kind === 'floor') f.push(entry);
      else b.push(entry);
    });
    return { floors: f, borders: b };
  }, [recent, library]);

  const isEmpty = floors.length === 0 && borders.length === 0;
  if (isEmpty) {
    return (
      <div className="text-xs text-muted-foreground italic">
        {t('preview.recentsEmpty')}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0 overflow-x-auto">
      {floors.length > 0 && (
        <div className="flex items-center gap-1.5">
          {floors.map(({ instance, index }) => (
            <TileRecentItem
              key={index}
              instance={instance}
              index={index}
              role="floor"
            />
          ))}
        </div>
      )}
      {floors.length > 0 && borders.length > 0 && (
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden />
      )}
      {borders.length > 0 && (
        <div className="flex items-center gap-1.5">
          {borders.map(({ instance, index }) => (
            <TileRecentItem
              key={index}
              instance={instance}
              index={index}
              role="border"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TileRecent;
