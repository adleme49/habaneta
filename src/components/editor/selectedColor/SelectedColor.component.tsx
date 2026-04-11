import React from 'react';
import { useStore } from '../../../store/store';

const SelectedColor: React.FC = () => {
  const { selectedColor } = useStore();
  return (
    <div className="flex justify-center py-4">
      <div
        className="h-16 w-16 border border-gray-800"
        style={{ background: selectedColor }}
      />
    </div>
  );
};

export default SelectedColor;
