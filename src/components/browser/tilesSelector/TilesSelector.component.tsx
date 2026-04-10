import React, { useContext } from 'react';
import TileItem from './TileItem.component';
import GeneralContext from '../../../context/global/general.context';
import { IBorder, IFloor } from '../../../context/interfaces';

const TilesSelector: React.FC = () => {
  const { selectedFamily } = useContext(GeneralContext);

  return selectedFamily ? (
    <div className="h-[70vh] overflow-y-auto">
      <div className="space-y-1">
        {selectedFamily.types.map((tile: IFloor | IBorder) => (
          <TileItem key={tile.name} tile={tile} />
        ))}
      </div>
    </div>
  ) : null;
};

export default TilesSelector;
