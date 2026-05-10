import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import EditorActions from '../editorActions/EditorActions.components';
import SVGTilePaint from './svgTile/SVGTilePaint.component';

/**
 * The tile canvas + action bar. Presets and palette are rendered as
 * siblings by TilesEditorLayout so they can bracket the tile (presets
 * on top, palette on bottom) without this component having to know
 * about them.
 */
const TileEditor: React.FC = () => {
  const { t } = useTranslation();
  const { editingResolved, paintLayer } = useStore();

  if (!editingResolved) {
    return (
      <div className="w-full text-center text-sm text-gray-400 py-16">
        {t('editor.selectTilePrompt')}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex justify-center w-full">
        <SVGTilePaint
          tile={editingResolved}
          colorLayer={(id) => paintLayer(id)}
        />
      </div>
      <EditorActions />
    </div>
  );
};

export default TileEditor;
