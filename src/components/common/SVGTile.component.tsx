import React from 'react';
import ReactSVG from 'react-svg';
import { ITile } from '../../context/interfaces';
import { getColorShapes, paintLayer } from '../../helpers';

const SVGTile: React.FC<{
  tile: ITile;
  onClickHandler?: (event: any) => void;
}> = ({ tile, onClickHandler }) => {
  return (
    <ReactSVG
      src={tile.imgUrl as string}
      onClick={onClickHandler}
      beforeInjection={svg => {
        svg.setAttribute('style', 'width: 40.42px; height: 40.42px');
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
