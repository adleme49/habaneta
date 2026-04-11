import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import TileItem from './TileItem.component';
import { useStore } from '../../../store/store';
import { TileSource } from '../../../lib/library';

/** How many tile thumbnails per virtualized row. */
const COLUMNS = 2;

/**
 * Rough height of one virtualized row. Each row fits COLUMNS items,
 * so it's close to the thumbnail height. `measureElement` overrides
 * this once the row has rendered for real, so the value only affects
 * initial scroll math.
 */
const ESTIMATED_ROW_HEIGHT = 140;

const OVERSCAN = 2;

/**
 * 2-column virtualized thumbnail grid. We group tiles into fixed-size
 * row arrays up front so the virtualizer can treat each row as a
 * single item — this keeps the windowing logic identical to a plain
 * vertical list without pulling in @tanstack/react-virtual's separate
 * column virtualizer.
 */
const TilesSelector: React.FC = () => {
  const { t } = useTranslation();
  const { selectedFamily, tilesForSelectedFamily } = useStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<TileSource[][]>(() => {
    const result: TileSource[][] = [];
    for (let i = 0; i < tilesForSelectedFamily.length; i += COLUMNS) {
      result.push(tilesForSelectedFamily.slice(i, i + COLUMNS));
    }
    return result;
  }, [tilesForSelectedFamily]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (index) => rows[index]?.[0]?.id ?? index,
  });

  if (!selectedFamily) {
    return (
      <div className="text-xs text-gray-400 px-2 py-4">
        {t('browser.selectCategory')}
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
          width: '100%',
        }}
      >
        {items.map((virtualItem) => {
          const row = rows[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="flex gap-1 px-0.5 pb-1"
            >
              {row.map((source) => (
                <div key={source.id} className="flex-1 min-w-0">
                  <TileItem source={source} />
                </div>
              ))}
              {/* Fill any empty cells on the last row so items stay
                  aligned to the left column instead of stretching */}
              {row.length < COLUMNS &&
                Array.from({ length: COLUMNS - row.length }).map((_, i) => (
                  <div key={`fill-${i}`} className="flex-1 min-w-0" />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TilesSelector;
