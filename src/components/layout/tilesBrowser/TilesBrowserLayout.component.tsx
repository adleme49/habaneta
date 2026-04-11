import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

const TilesBrowserLayout: React.FC = () => {
  const { t } = useTranslation();
  const { families, isBrowserCollapsed, toggleBrowserCollapsed } = useStore();

  if (isBrowserCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-3">
        <button
          type="button"
          onClick={toggleBrowserCollapsed}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          title={t('browser.expand')}
          aria-label={t('browser.expand')}
        >
          »
        </button>
        <div
          className="mt-4 text-[10px] uppercase tracking-wide text-gray-400"
          style={{ writingMode: 'vertical-rl' }}
        >
          {t('browser.verticalLabel')}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          {t('browser.title')}
        </h2>
        <button
          type="button"
          onClick={toggleBrowserCollapsed}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          title={t('browser.collapse')}
          aria-label={t('browser.collapse')}
        >
          «
        </button>
      </div>
      <div className="px-2 pt-2 flex-shrink-0">
        <Category title={t('browser.tiles')} families={families} kind="floor" />
        <Category title={t('browser.border')} families={families} kind="border" />
      </div>
      <div className="flex-1 min-h-0 border-t mt-2 pt-1">
        <TilesSelector />
      </div>
    </div>
  );
};

export default TilesBrowserLayout;
