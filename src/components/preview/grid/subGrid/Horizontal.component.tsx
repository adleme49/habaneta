import React from 'react';
import { IBorder } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';

const vhorizontal = [1, 2, 3, 4, 5, 6];
const Horizontal: React.FC<{
  orientation: 'TOP' | 'BOTTOM';
  tile: IBorder;
}> = ({ orientation, tile }) => {
  return (
    <div className="flex p-0 m-0">
      <div className="flex-1 p-0 m-0">
        {tile ? (
          <SVGTile
            check={true}
            tile={tile}
            url={tile.cornerUrl}
            rotation={orientation === 'TOP' ? -90 : 180}
          />
        ) : (
          <img src={empty} alt="" />
        )}
      </div>
      {vhorizontal.map((_: number) => (
        <div className="flex-1 p-0 m-0" key={_}>
          {tile ? (
            <SVGTile tile={tile} rotation={orientation === 'TOP' ? 0 : 180} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
      ))}
      <div className="flex-1 p-0 m-0">
        {tile ? (
          <SVGTile
            tile={tile}
            url={tile.cornerUrl}
            rotation={orientation === 'TOP' ? 0 : 90}
          />
        ) : (
          <img src={empty} alt="" />
        )}
      </div>
    </div>
  );
};

export default Horizontal;
