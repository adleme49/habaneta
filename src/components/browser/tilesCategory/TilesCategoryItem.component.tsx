import React from 'react';
import { IBorderFamily, ITileFamily } from '../../../context/interfaces';
import { useStore } from '../../../store/store';

const CategoryItem: React.FC<{
  categoryItem: IBorderFamily | ITileFamily;
}> = ({ categoryItem }) => {
  const { setSelectedFamily, selectedFamily } = useStore();
  const isActive = selectedFamily?.name === categoryItem.name;

  return (
    <li
      className={`px-3 py-2 cursor-pointer text-sm ${
        isActive ? 'bg-blue-50 font-medium text-blue-700' : 'hover:bg-gray-100'
      }`}
      onClick={() => setSelectedFamily(categoryItem)}
    >
      {categoryItem.name}
    </li>
  );
};

export default CategoryItem;
