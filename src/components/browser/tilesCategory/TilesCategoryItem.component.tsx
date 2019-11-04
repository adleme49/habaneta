import React from 'react';
import { IonItem } from '@ionic/react';

const TilesCategoryItem: React.FC<{ categoryItem: string | {} }> = ({
  categoryItem
}) => {
  return <IonItem>{categoryItem}</IonItem>;
};

export default TilesCategoryItem;
