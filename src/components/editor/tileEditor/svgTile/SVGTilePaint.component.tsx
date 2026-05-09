import React from 'react';
import { ReactSVG } from 'react-svg';
import { ITile } from '../../../../context/interfaces';
import { getColorShapes, paintLayer } from '../../../../helpers';
import CompositionCanvas from '../../../common/CompositionCanvas.component';

const SVGTilePaint: React.FC<{
  tile: ITile;
  colorLayer: (layerId: string) => void;
}> = ({ tile, colorLayer }) => {
  // v2 path: render via CompositionCanvas and extract the click target's
  // class name directly. The v2 atom uses `class="layer-N"` /
  // `class="contour"` (single class), so we pass it through unchanged
  // — the legacy `class="colora stN"` two-class extraction doesn't
  // apply.
  if (tile.pipeline) {
    return (
      <div
        className="w-full max-w-[480px] aspect-square mx-auto"
        onClick={(event) => {
          const cls = (event.target as Element).getAttribute?.('class') ?? '';
          if (cls === 'contour' || /^layer-\d+$/.test(cls)) {
            colorLayer(cls);
          }
        }}
      >
        <CompositionCanvas
          pipeline={tile.pipeline}
          mode="single"
          layers={tile.layers}
        />
      </div>
    );
  }

  if (!tile.imgUrl) return null;
  return (
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
