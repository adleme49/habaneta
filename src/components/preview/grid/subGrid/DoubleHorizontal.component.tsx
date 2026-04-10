import React from 'react';
import { IBorder } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';

const horizontal1 = [1, 2, 3, 4, 5, 6, 7, 8];
const DoubleHorizontal: React.FC<{
  tile: IBorder | undefined;
}> = ({ tile }) => {
  return (
    <>
      <div className="flex p-0 m-0">
        {horizontal1.map((column: number) =>
          column === 8 ? (
            <div className="flex-1 p-0 m-0" key={column}>
              {tile ? (
                <SVGTile check={true} tile={tile} url={tile.cornerUrl} rotation={90} />
              ) : (
                <img src={empty} alt="" />
              )}
            </div>
          ) : (
            <div className="flex-1 p-0 m-0" key={column}>
              {tile ? (
                <SVGTile tile={tile} rotation={0} />
              ) : (
                <img src={empty} alt="" />
              )}
            </div>
          )
        )}
      </div>
      <div className="flex p-0 m-0">
        {horizontal1.map((column: number) =>
          column === 7 ? (
            <div className="flex-1 p-0 m-0" key={column}>
              {tile ? (
                <SVGTile tile={tile} url={tile.cornerInteriorUrl} rotation={90} />
              ) : (
                <img src={empty} alt="" />
              )}
            </div>
          ) : column === 8 ? (
            <div className="flex-1 p-0 m-0" key={column}>
              {tile ? (
                <SVGTile tile={tile} rotation={90} />
              ) : (
                <img src={empty} alt="" />
              )}
            </div>
          ) : (
            <div className="flex-1 p-0 m-0" key={column}>
              {tile ? (
                <SVGTile tile={tile} rotation={180} />
              ) : (
                <img src={empty} alt="" />
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default DoubleHorizontal;
