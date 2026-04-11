import React from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import SVGTileBase from '../../../common/SVGBase.component';
import TileInfoList from './TileInfoList.component';

const TileInfo: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <h1>{tile.type === 'Floor' ? 'Piso' : 'Borde'}</h1>
        <SVGTileBase tile={tile} style={{ width: '100%' }} />
      </div>
      <div>
        <h1>
          <span className="text-blue-500">Modelo:</span> {tile.name}
        </h1>
        <h1>Colores:</h1>
        {tile.layers ? <TileInfoList layers={tile.layers} /> : null}
      </div>
    </div>
  );
};

export default TileInfo;
