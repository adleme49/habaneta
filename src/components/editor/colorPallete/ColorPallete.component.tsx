import React, { useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import EditorContext from '../../../context/editor/editor.context';
import { SwatchesPicker } from 'react-color';

const ColorPallete: React.FC = () => {
  const { colors } = useContext(GeneralContext);
  const { setColor } = useContext(EditorContext);

  const handleSetColor = (color: any) => {
    setColor(color.hex);
  };

  return (
    <div style={{ border: 'solid 2px black', width: '450px' }}>
      <SwatchesPicker colors={colors} width={450} onChange={handleSetColor} />
    </div>
  );
};

export default ColorPallete;
