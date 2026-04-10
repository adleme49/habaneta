import React, { useContext } from 'react';
import { IBorderFamily, ITileFamily } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const CategoryItem: React.FC<{
  categoryItem: IBorderFamily | ITileFamily;
}> = ({ categoryItem }) => {
  const { setCurrentFamily } = useContext(GeneralContext);

  const handleClick = () => {
    setCurrentFamily(categoryItem);
  };

  return (
    <li
      className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
      onClick={handleClick}
    >
      {categoryItem.name}
    </li>
  );
};

export default CategoryItem;
