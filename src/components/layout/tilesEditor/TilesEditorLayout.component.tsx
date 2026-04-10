import React from 'react';
import SelectedColor from '../../editor/selectedColor/SelectedColor.component';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

const TilesEditorLayout: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Editor</h2>
      <div className="flex justify-center">
        <ColorPallete />
      </div>
      <SelectedColor />
      <TileEditor />
    </div>
  );
};

export default TilesEditorLayout;
