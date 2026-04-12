import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IBorder, IFloor } from '../../../../context/interfaces';
import { useStore } from '../../../../store/store';
import DoubleHorizontal from './DoubleHorizontal.component';
import DoubleBody from './DoubleBody.component';

/**
 * Corner-border variant: top DoubleHorizontal + N × DoubleBody.
 * (DoubleGrid has no bottom horizontal — that math is baked into
 * each DoubleBody's interior transitions.)
 *
 * Rows are windowed via @tanstack/react-virtual for the same
 * reason as SimpleGrid — lets us raise MAX_BODY_ROWS without the
 * render cost exploding. See SimpleGrid for the detailed comments.
 */

const ESTIMATED_ROW_HEIGHT = 88;
const OVERSCAN = 2;

type RowKind = 'top' | 'body';
interface Row {
  kind: RowKind;
  key: string;
}

const DoubleGrid: React.FC<{
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
    return out;
  }, [gridBodyRows]);

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
    if (row.kind === 'top') return <DoubleHorizontal tile={selectedBorder} />;
    return (
      <DoubleBody
        borderTile={selectedBorder}
        floorTile={selectedFloor}
        selectedGrid={selectedGrid}
      />
    );
  };

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

export default DoubleGrid;
