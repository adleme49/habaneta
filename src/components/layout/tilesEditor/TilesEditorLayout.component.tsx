import React from 'react';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

/**
 * Editor section. Header row removed — the column's identity is
 * obvious from the palette and the painted tile below it, and the
 * extra ~40px header was pure chrome.
 */
const TilesEditorLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
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
