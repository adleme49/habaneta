import React from 'react';
import { IColor } from '../../../context/interfaces';
import { useStore } from '../../../store/store';

const ColorPalleteItem: React.FC<{ color: IColor }> = ({ color }) => {
  const { setSelectedColor } = useStore();

  return (
    <div
      className="h-20 cursor-pointer"
      style={{ background: color.code }}
      onClick={() => setSelectedColor(color.code)}
    />
  );
};

export default ColorPalleteItem;
