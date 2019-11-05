import React from 'react';
import { IonItem } from '@ionic/react';
import { borderCategory, tileCategory } from '../../../context/interfaces';

const CategoryItem: React.FC<{
  categoryItem: borderCategory | tileCategory;
}> = ({ categoryItem }) => {
  return <IonItem>{categoryItem.name}</IonItem>;
};

export default CategoryItem;
