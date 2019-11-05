import React, { Fragment } from 'react';
import { IonList, IonListHeader, IonLabel } from '@ionic/react';
import CategoryItem from './TilesCategoryItem.component';
import { tileCategory, borderCategory } from '../../../context/interfaces';

const Category: React.FC<{
  title: string;
  tileCat?: tileCategory[];
  borderCat?: borderCategory[];
}> = ({ title, tileCat, borderCat }) => {
  const items = [
    'Tradicional',
    'Tradicional 2',
    'Tradicional 3',
    'Tradicional 4',
    'Tradicional 5',
    'Tradicional 6'
  ];
  return (
    <Fragment>
      <IonList>
        <IonListHeader>
          <IonLabel>{title}</IonLabel>
        </IonListHeader>
        {tileCat
          ? tileCat.map((item: tileCategory) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
        {borderCat
          ? borderCat.map((item: borderCategory) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
      </IonList>
    </Fragment>
  );
};

export default Category;
