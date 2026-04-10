import React, { useContext } from 'react';
import EditorContext from '../../../context/editor/editor.context';
import EditorActions from '../editorActions/EditorActions.components';
import SVGTilePaint from './svgTile/SVGTilePaint.component';

const TileEditor: React.FC = () => {
  const { tile, paintLayer } = useContext(EditorContext);

  const colorLayer = (layerId: string) => {
    paintLayer(layerId);
  };

  return tile ? (
    <>
      <div className="flex justify-center">
        <SVGTilePaint tile={tile} colorLayer={colorLayer} />
      </div>
      <div className="flex justify-center">
        <EditorActions />
      </div>
    </>
  ) : null;
};

export default TileEditor;
