import React from 'react';
import { useStore } from '../../../store/store';
import EditorActions from '../editorActions/EditorActions.components';
import SVGTilePaint from './svgTile/SVGTilePaint.component';

const TileEditor: React.FC = () => {
  const { editingTile, paintLayer } = useStore();

  if (!editingTile) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        Select a tile to start editing
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <SVGTilePaint tile={editingTile} colorLayer={(id) => paintLayer(id)} />
      </div>
      <div className="flex justify-center">
        <EditorActions />
      </div>
    </>
  );
};

export default TileEditor;
