import React from 'react';
import { useStore } from '../../../store/store';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

/**
 * Browser sidebar with collapse support.
 *
 *   Expanded: header (with collapse arrow) + categories +
 *             virtualized tile grid
 *   Collapsed: 32px-wide strip with only an expand arrow, so
 *              the editor + preview get the extra ~190px of
 *              horizontal space
 */
const TilesBrowserLayout: React.FC = () => {
  const { families, isBrowserCollapsed, toggleBrowserCollapsed } = useStore();

  if (isBrowserCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-3">
        <button
          type="button"
          onClick={toggleBrowserCollapsed}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          title="Expand browser"
          aria-label="Expand browser"
        >
          »
        </button>
        <div
          className="mt-4 text-[10px] uppercase tracking-wide text-gray-400"
          style={{ writingMode: 'vertical-rl' }}
        >
          Tiles
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Buscador de Lozas
        </h2>
        <button
          type="button"
          onClick={toggleBrowserCollapsed}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          title="Collapse browser"
          aria-label="Collapse browser"
        >
          «
        </button>
      </div>
      <div className="px-2 pt-2 flex-shrink-0">
        <Category title="TILES" families={families} kind="floor" />
        <Category title="BORDER" families={families} kind="border" />
      </div>
      <div className="flex-1 min-h-0 border-t mt-2 pt-1">
        <TilesSelector />
      </div>
    </div>
  );
};

export default TilesBrowserLayout;
