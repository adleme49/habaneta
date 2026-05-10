import React from 'react';
import { FamilyMeta } from '../../../lib/library';
import { useStore } from '../../../store/store';

const CategoryItem: React.FC<{ family: FamilyMeta }> = ({ family }) => {
  const { setSelectedFamily, selectedFamily } = useStore();
  const isActive =
    selectedFamily?.name === family.name && selectedFamily?.kind === family.kind;

  return (
    <li
      className={`px-3 py-2 cursor-pointer text-sm ${
        isActive ? 'bg-blue-50 font-medium text-blue-700' : 'hover:bg-gray-100'
      }`}
      onClick={() => setSelectedFamily(family)}
    >
      {family.name}{' '}
      <span className="text-xs text-gray-400">({family.count})</span>
    </li>
  );
};

export default CategoryItem;
