import React from 'react';
import CategoryItem from './TilesCategoryItem.component';
import { FamilyMeta, TileKind } from '../../../lib/library';

const Category: React.FC<{
  title: string;
  families: FamilyMeta[];
  kind: TileKind;
}> = ({ title, families, kind }) => {
  const filtered = families.filter((f) => f.kind === kind);
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">
        {title}
      </h3>
      <ul className="divide-y divide-gray-200">
        {filtered.map((family) => (
          <CategoryItem key={family.name} family={family} />
        ))}
      </ul>
    </div>
  );
};

export default Category;
