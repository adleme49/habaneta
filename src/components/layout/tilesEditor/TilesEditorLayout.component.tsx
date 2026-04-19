import React from 'react';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import Presets from '../../editor/presets/Presets.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

/**
 * Editor column. Stacked top-to-bottom:
 *   1. Preset chip strip (compact; "+ New preset" opens a modal).
 *   2. Tile canvas + horizontal action bar.
 *   3. Palette (main grid + shades + My colors).
 *
 * On tall viewports this fits in one screen with no scroll
 * (presets ~32px + tile ~480 + actions 32 + palette ~160 ≈ 700px).
 * overflow-y-auto stays as a fallback for short viewports so
 * nothing is ever inaccessible.
 */
const TilesEditorLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center px-4 pt-3 pb-4 gap-3 w-full max-w-[480px] mx-auto">
        <Presets />
        <TileEditor />
        <ColorPallete />
      </div>
    </div>
  );
};

export default TilesEditorLayout;
