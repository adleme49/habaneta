import React from 'react';
import { useStore } from '../../../store/store';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

/**
 * Browser sidebar. Fixed-height column:
 *
 *   ┌──────────────────────┐
 *   │ Header (flex-shrink) │
 *   │ Categories           │
 *   │ ─────                │
 *   │ Tile selector grid   │
 *   │   (flex-1, scrolls)  │
 *   └──────────────────────┘
 */
const TilesBrowserLayout: React.FC = () => {
  const { families } = useStore();

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-700">
          Buscador de Lozas
        </h2>
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
