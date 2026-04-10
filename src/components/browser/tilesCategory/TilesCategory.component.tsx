import React from 'react';
import CategoryItem from './TilesCategoryItem.component';
import { ITileFamily, IBorderFamily } from '../../../context/interfaces';

const Category: React.FC<{
  title: string;
  tileFamilys?: ITileFamily[];
  borderFamilys?: IBorderFamily[];
}> = ({ title, tileFamilys, borderFamilys }) => {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">
        {title}
      </h3>
      <ul className="divide-y divide-gray-200">
        {tileFamilys?.map((item: ITileFamily) => (
          <CategoryItem key={item.name} categoryItem={item} />
        ))}
        {borderFamilys?.map((item: IBorderFamily) => (
          <CategoryItem key={item.name} categoryItem={item} />
        ))}
      </ul>
    </div>
  );
};

export default Category;
