import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore, MAX_BODY_ROWS, MIN_BODY_ROWS } from '../../../store/store';
import { Button } from '@/components/ui/button';

const GridSizeControl: React.FC = () => {
  const { t } = useTranslation();
  const { gridBodyRows, setGridBodyRows } = useStore();

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-700">
      <span>{t('preview.gridSize')}</span>
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGridBodyRows(gridBodyRows - 1)}
          disabled={gridBodyRows <= MIN_BODY_ROWS}
          aria-label={t('preview.fewerRows')}
          className="h-7 w-7 p-0 rounded-r-none border-r-0"
        >
          −
        </Button>
        <span
          className="tabular-nums w-7 h-7 flex items-center justify-center border border-input text-sm bg-white"
          aria-live="polite"
        >
          {gridBodyRows}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setGridBodyRows(gridBodyRows + 1)}
          disabled={gridBodyRows >= MAX_BODY_ROWS}
          aria-label={t('preview.moreRows')}
          className="h-7 w-7 p-0 rounded-l-none border-l-0"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default GridSizeControl;
