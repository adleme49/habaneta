import React from 'react';
import { useTranslation } from 'react-i18next';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

/**
 * Editor section. Sticky header on top, internally-scrollable body.
 * Body stacks palette → tile → actions → presets. SelectedColor is
 * no longer rendered separately — the palette's preview row already
 * shows the active color.
 */
const TilesEditorLayout: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex-shrink-0 bg-white">
        <h2 className="text-sm font-semibold text-gray-700">
          {t('editor.title')}
        </h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center p-4 gap-3">
          <ColorPallete />
          <TileEditor />
        </div>
      </div>
    </div>
  );
};

export default TilesEditorLayout;
