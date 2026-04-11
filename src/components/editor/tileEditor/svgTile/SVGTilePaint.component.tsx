import React from 'react';
import { ReactSVG } from 'react-svg';
import { ITile } from '../../../../context/interfaces';
import { getColorShapes, paintLayer } from '../../../../helpers';

const SVGTilePaint: React.FC<{
  tile: ITile;
  colorLayer: (layerId: string) => void;
}> = ({ tile, colorLayer }) => {
  if (!tile.imgUrl) return null;
  return (
    // Responsive square container — fills its column up to 480px.
    // The injected SVG stretches to 100% of this box via inline style,
    // and the viewBox keeps its aspect ratio intact.
    <div className="w-full max-w-[480px] aspect-square mx-auto">
      <ReactSVG
        src={tile.imgUrl}
        className="w-full h-full block"
        afterInjection={() => {}}
        beforeInjection={(svg) => {
          svg.setAttribute(
            'style',
            'width: 100%; height: 100%; display: block;'
          );
          const shapes = getColorShapes(svg);
          if (tile.layers) {
            Object.keys(tile.layers).forEach((layerId) => {
              if (tile.layers) {
                paintLayer(shapes, layerId, tile.layers[layerId]);
              }
            });
          }
        }}
        fallback={() => <span>Error!</span>}
        loading={() => <span>Loading</span>}
        onClick={(event) => {
          const targetClass = ((event.target as Element).getAttribute(
            'class'
          ) as string).split(' ')[1];
          colorLayer(targetClass);
        }}
      />
    </div>
  );
};

export default SVGTilePaint;
