import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IBorder, IFloor } from '../../../../context/interfaces';
import { useStore } from '../../../../store/store';
import Horizontal from './Horizontal.component';
import Body from './Body.component';

/**
 * Top border row → N × body → bottom border row.
 *
 * N body rows come from the store (gridBodyRows, clamped to
 * [1, MAX_BODY_ROWS]). Rows are row-virtualized via
 * @tanstack/react-virtual so that large grids stay smooth —
 * without windowing, 20 body rows would put ~336 SVG tiles in
 * the DOM with color manipulations on every one, and the render
 * cost would be visible as jank.
 *
 * Everything (top border, bodies, bottom border) is unified into
 * a single row list so the virtualizer scroll math is trivial.
 * The scroll element is the `#grid` overflow-auto container in
 * TilesPreviewLayout; we look it up by id rather than threading
 * a ref through several layers.
 *
 * When `isExporting` is true (store flag) the virtualizer is
 * bypassed and all rows are rendered plainly so a dom-to-image
 * snapshot captures every row, not just the ones currently in
 * the viewport.
 */

const ESTIMATED_ROW_HEIGHT = 88;
const OVERSCAN = 2;

type RowKind = 'top' | 'body' | 'bottom';
interface Row {
  kind: RowKind;
  /** Stable key for virtualizer/React reconciliation. */
  key: string;
}

const SimpleGrid: React.FC<{
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
}> = ({ selectedFloor, selectedBorder, selectedGrid }) => {
  const { gridBodyRows, isExporting } = useStore();

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [{ kind: 'top', key: 'top' }];
    for (let i = 0; i < gridBodyRows; i++) {
      out.push({ kind: 'body', key: `body-${i}` });
    }
    out.push({ kind: 'bottom', key: 'bottom' });
    return out;
  }, [gridBodyRows]);

  // Resolve the scroll container once on mount. TilesPreviewLayout
  // owns `#grid`, and SimpleGrid itself only renders children of
  // that container — so the lookup is stable.
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const measuringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setScrollElement(document.getElementById('grid'));
  }, []);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (i) => rows[i].key,
  });

  const renderRow = (row: Row) => {
    if (row.kind === 'top') {
      return (
        <Horizontal orientation="TOP" tile={selectedBorder as IBorder} />
      );
    }
    if (row.kind === 'bottom') {
      return (
        <Horizontal orientation="BOTTOM" tile={selectedBorder as IBorder} />
      );
    }
    return (
      <Body
        borderTile={selectedBorder}
        floorTile={selectedFloor}
        grid={selectedGrid}
      />
    );
  };

  // Export path: render everything plainly so dom-to-image captures
  // every row regardless of scroll position. We still render into
  // the same position so the #grid node's scrollHeight reflects the
  // full content, which the export helper uses to size the canvas.
  if (isExporting || !scrollElement) {
    return (
      <div ref={measuringRef}>
        {rows.map((row) => (
          <React.Fragment key={row.key}>{renderRow(row)}</React.Fragment>
        ))}
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
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
            data-row-kind={row.kind}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderRow(row)}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleGrid;
