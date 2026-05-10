import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import { GRID_PATTERNS } from '../../../constants/floor';

/**
 * Global grid-pattern selector. "Auto" = tile-driven (store keeps
 * selectedGridPatternId undefined); any other value overrides the
 * floor rendering with that registry pattern's angles.
 */
const GridPatternControl: React.FC = () => {
  const { t } = useTranslation();
  const { selectedGridPatternId, setSelectedGridPatternId } = useStore();

  return (
    <label
      htmlFor="grid-pattern-select"
      className="flex items-center gap-1.5 text-sm text-gray-700"
    >
      <span>{t('preview.gridPattern')}</span>
      <select
        id="grid-pattern-select"
        value={selectedGridPatternId ?? 'auto'}
        onChange={(e) => {
          const v = e.target.value;
          setSelectedGridPatternId(v === 'auto' ? undefined : v);
        }}
        className="rounded border border-input bg-white px-2 py-1 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="auto">{t('preview.gridPatterns.auto')}</option>
        {GRID_PATTERNS.map((p) => (
          <option key={p.id} value={p.id}>
            {t(`preview.gridPatterns.${p.i18nKey}`)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default GridPatternControl;
