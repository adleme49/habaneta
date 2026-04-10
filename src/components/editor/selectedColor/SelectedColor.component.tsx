import React, { useContext } from 'react';
import EditorContext from '../../../context/editor/editor.context';

const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(EditorContext);
  return (
    <div className="flex justify-center py-6">
      <div
        className="h-20 w-20 border border-gray-800"
        style={{ background: selectedColor }}
      />
    </div>
  );
};

export default SelectedColor;
