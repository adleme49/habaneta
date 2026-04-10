import React, { useContext } from 'react';
import Default from '../../../theme/102.png';
import { IFloor, IBorder } from '../../../context/interfaces';
import EditorContext from '../../../context/editor/editor.context';
import GeneralContext from '../../../context/global/general.context';
import SVGTileBase from '../../common/SVGBase.component';

const TileItem: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  const { disableRecent } = useContext(GeneralContext);
  const { setTile } = useContext(EditorContext);

  const handleClick = () => {
    disableRecent();
    setTile(tile);
  };

  return tile ? (
    <div className="cursor-pointer hover:bg-gray-50 p-1" onClick={handleClick}>
      {tile.imgUrl ? (
        <SVGTileBase tile={tile} style={{ width: 300 }} />
      ) : (
        <img src={Default} alt={tile.name} />
      )}
    </div>
  ) : null;
};

export default TileItem;
