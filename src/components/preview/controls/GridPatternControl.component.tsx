import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import { GRID_PATTERNS } from '../../../constants/floor';

/**
 * Global grid-pattern selector. Sits next to the grid-size stepper.
 * Value "auto" means "tile-driven" (store keeps selectedGridPatternId
 * undefined), any other value picks a registry pattern whose angles
 * override the floor rendering.
 */
const GridPatternControl: React.FC = () => {
  const { t } = useTranslation();
  const { selectedGridPatternId, setSelectedGridPatternId } = useStore();

  return (
    <div className="flex items-center gap-2 text-sm">
      <label
        htmlFor="grid-pattern-select"
        className="text-xs text-muted-foreground uppercase tracking-wide"
      >
        {t('preview.gridPattern')}
      </label>
      <select
        id="grid-pattern-select"
        value={selectedGridPatternId ?? 'auto'}
        onChange={(e) => {
          const v = e.target.value;
          setSelectedGridPatternId(v === 'auto' ? undefined : v);
        }}
        className="rounded border border-input bg-transparent px-2 py-1 text-sm"
      >
        <option value="auto">{t('preview.gridPatterns.auto')}</option>
        {GRID_PATTERNS.map((p) => (
          <option key={p.id} value={p.id}>
            {t(`preview.gridPatterns.${p.i18nKey}`)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GridPatternControl;
