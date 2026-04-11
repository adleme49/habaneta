import React from 'react';
import { useStore } from '../../../store/store';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

const TilesBrowserLayout: React.FC = () => {
  const { tilesFamilys, borderFamilys } = useStore();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Buscador de Lozas</h2>
      <div className="grid grid-cols-[1fr_1fr] gap-2">
        <div>
          <Category title={'TILES'} tileFamilys={tilesFamilys} />
          <Category title={'BORDER'} borderFamilys={borderFamilys} />
        </div>
        <div>
          <TilesSelector />
        </div>
      </div>
    </div>
  );
};

export default TilesBrowserLayout;
