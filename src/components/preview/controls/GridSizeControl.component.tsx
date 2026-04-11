import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import {
  MAX_BODY_ROWS,
  MIN_BODY_ROWS,
} from '../../../store/store';
import { Button } from '@/components/ui/button';

const GridSizeControl: React.FC = () => {
  const { t } = useTranslation();
  const { gridBodyRows, setGridBodyRows } = useStore();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {t('preview.gridSize')}
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGridBodyRows(gridBodyRows - 1)}
          disabled={gridBodyRows <= MIN_BODY_ROWS}
          aria-label={t('preview.fewerRows')}
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
          aria-label={t('preview.moreRows')}
          className="h-7 w-7 p-0"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default GridSizeControl;
