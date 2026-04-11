import React from 'react';
import { useStore } from '../../../store/store';
import EditorActions from '../editorActions/EditorActions.components';
import Presets from '../presets/Presets.component';
import SVGTilePaint from './svgTile/SVGTilePaint.component';

const TileEditor: React.FC = () => {
  const { editingResolved, paintLayer } = useStore();

  if (!editingResolved) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        Select a tile to start editing
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <SVGTilePaint
          tile={editingResolved}
          colorLayer={(id) => paintLayer(id)}
        />
      </div>
      <div className="flex justify-center">
        <EditorActions />
      </div>
      <div className="flex justify-center">
        <Presets />
      </div>
    </>
  );
};

export default TileEditor;
