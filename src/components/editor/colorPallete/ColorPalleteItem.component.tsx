import React, { useContext } from 'react';
import { IColor } from '../../../context/interfaces';
import EditorContext from '../../../context/editor/editor.context';

const ColorPalleteItem: React.FC<{ color: IColor }> = ({ color }) => {
  const { setColor } = useContext(EditorContext);

  const handleSetColor = () => {
    setColor(color.code);
  };

  return (
    <div
      className="h-20 cursor-pointer"
      style={{ background: color.code }}
      onClick={handleSetColor}
    />
  );
};

export default ColorPalleteItem;
