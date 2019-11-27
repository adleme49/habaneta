import React from 'react';
import ReactSVG from 'react-svg';
import { ITile } from '../../../../context/interfaces';
import { getColorShapes, paintLayer } from '../../../../helpers';

const SVGTilePaint: React.FC<{
  tile: ITile;
  colorLayer: (layerId: string) => void;
}> = ({ tile, colorLayer }) => {
  return tile.imgUrl ? (
    <ReactSVG
      src={tile.imgUrl}
      afterInjection={(error, svg) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(svg);
      }}
      beforeInjection={svg => {
        svg.classList.add('svg-class-name');
        svg.setAttribute('style', 'width: 250px; height: 250px');
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
      renumerateIRIElements={false}
      wrapper="span"
      className="wrapper-class-name"
      onClick={event => {
        console.log('wrapper onClick');
        const targetClass = ((event.target as Element).getAttribute(
          'class'
        ) as string).split(' ')[1];
        console.log(targetClass);
        colorLayer(targetClass);
      }}
    />
  ) : null;
};
export default SVGTilePaint;

