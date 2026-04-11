import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import TileItem from './TileItem.component';
import { useStore } from '../../../store/store';

/**
 * Rough height of one tile item (including padding) — used as the
 * virtualizer's estimate. The measured size overrides this once each
 * item has rendered, so the value only affects initial scroll math.
 */
const ESTIMATED_ITEM_HEIGHT = 260;

/**
 * Approximate number of items to render outside the visible window.
 * Higher = smoother scrolling but more DOM nodes mounted; 2 is plenty
 * for a vertical list where each item is a painted SVG.
 */
const OVERSCAN = 2;

const TilesSelector: React.FC = () => {
  const { selectedFamily, tilesForSelectedFamily } = useStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tilesForSelectedFamily.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: OVERSCAN,
    // Re-measure when the selected family changes so scroll math stays right
    // even if the user jumps between families with very different tile sizes.
    getItemKey: (index) => tilesForSelectedFamily[index]?.id ?? index,
  });

  if (!selectedFamily) {
    return (
      <div className="text-xs text-gray-400 px-2 py-4">
        Select a category →
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-[70vh] overflow-y-auto"
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
          const source = tilesForSelectedFamily[virtualItem.index];
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
            >
              <TileItem source={source} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TilesSelector;
