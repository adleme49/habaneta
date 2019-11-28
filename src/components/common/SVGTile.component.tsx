import React from 'react';
import ReactSVG from 'react-svg';
import { ITile } from '../../context/interfaces';
import { getColorShapes, paintLayer, styleSVG } from '../../helpers';

const SVGTile: React.FC<{
  tile: ITile;
  width?: number;
  height?: number;
  rotation?: number;
  url?: string;
  onClickHandler?: (event: any) => void;
}> = ({ tile, width, height, rotation, onClickHandler, url }) => {
  return (
    <ReactSVG
      src={url ? url : (tile.imgUrl as string)}
      onClick={onClickHandler}
      beforeInjection={svg => {
        styleSVG(svg, { width, height, rotation });
        const shapes = getColorShapes(svg);
        if (tile.layers) {
          Object.keys(tile.layers).forEach(layerId => {
            if (tile.layers) {
              paintLayer(shapes, layerId, tile.layers[layerId]);
            }
          });
        }
      }}
    />
  );
};

export default SVGTile;
