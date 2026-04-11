import React from 'react';
import { useStore } from '../../../store/store';
import {
  MAX_BODY_ROWS,
  MIN_BODY_ROWS,
} from '../../../store/store';
import { Button } from '@/components/ui/button';

/**
 * Stepper for the floor grid body row count. Each "row" is a Body
 * component which itself draws 2 flex rows of tiles, so 3 body rows
 * = 6 actual tile rows. The label shows the logical count.
 */
const GridSizeControl: React.FC = () => {
  const { gridBodyRows, setGridBodyRows } = useStore();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        Grid size
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGridBodyRows(gridBodyRows - 1)}
          disabled={gridBodyRows <= MIN_BODY_ROWS}
          aria-label="Fewer rows"
          className="h-7 w-7 p-0"
        >
          −
        </Button>
        <span className="tabular-nums w-6 text-center" aria-live="polite">
          {gridBodyRows}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGridBodyRows(gridBodyRows + 1)}
          disabled={gridBodyRows >= MAX_BODY_ROWS}
          aria-label="More rows"
          className="h-7 w-7 p-0"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default GridSizeControl;
