import React from 'react';
import { IFloor } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';
import {
  getTopLeftAngle,
  getTopRightAngle,
  getBottomLeftAngle,
  getBottomRightAngle
} from '../../../../constants/floor';

const FloorGrid: React.FC<{
  orientation: 'TOP' | 'BOTTOM';
  tile?: IFloor;
  grid?: number[];
}> = ({ orientation, tile, grid }) => {
  return (
    <>
      <div className="flex-1 p-0 m-0">
        {tile ? (
          <SVGTile
            check={true}
            tile={tile}
            rotation={
              orientation === 'TOP'
                ? getTopLeftAngle(grid)
                : getBottomLeftAngle(grid)
            }
          />
        ) : (
          <img src={empty} alt="" />
        )}
      </div>
      <div className="flex-1 p-0 m-0">
        {tile ? (
          <SVGTile
            tile={tile}
            rotation={
              orientation === 'TOP'
                ? getTopRightAngle(grid)
                : getBottomRightAngle(grid)
            }
          />
        ) : (
          <img src={empty} alt="" />
        )}
      </div>
    </>
  );
};

export default FloorGrid;
