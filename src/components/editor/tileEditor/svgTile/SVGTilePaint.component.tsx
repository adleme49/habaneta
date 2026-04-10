import React from 'react';
import { ReactSVG } from 'react-svg';
import { ITile } from '../../../../context/interfaces';
import { getColorShapes, paintLayer, styleSVG } from '../../../../helpers';

const SVGTilePaint: React.FC<{
  tile: ITile;
  colorLayer: (layerId: string) => void;
}> = ({ tile, colorLayer }) => {
  return tile.imgUrl ? (
    <ReactSVG
      src={tile.imgUrl}
      afterInjection={() => {}}
      beforeInjection={svg => {
        styleSVG(svg, { width: 450, height: 450 });
        const shapes = getColorShapes(svg);
        if (tile.layers) {
          Object.keys(tile.layers).forEach(layerId => {
            if (tile.layers) {
              paintLayer(shapes, layerId, tile.layers[layerId]);
            }
          });
        }
      }}
      fallback={() => <span>Error!</span>}
      loading={() => <span>Loading</span>}
      onClick={event => {
        const targetClass = ((event.target as Element).getAttribute(
          'class'
        ) as string).split(' ')[1];
        colorLayer(targetClass);
      }}
    />
  ) : null;
};
export default SVGTilePaint;
