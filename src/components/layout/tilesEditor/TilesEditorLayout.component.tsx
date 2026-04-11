import React from 'react';
import SelectedColor from '../../editor/selectedColor/SelectedColor.component';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

/**
 * Editor section. Sticky header on top, internally-scrollable body.
 * The body stacks palette → tile → actions → presets. Narrow column
 * so we keep things vertical for now; a horizontal palette/tile
 * split can happen when we widen the editor column further.
 */
const TilesEditorLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex-shrink-0 bg-white">
        <h2 className="text-sm font-semibold text-gray-700">Editor</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center p-4 gap-2">
          <ColorPallete />
          <SelectedColor />
          <TileEditor />
        </div>
      </div>
    </div>
  );
};

export default TilesEditorLayout;
