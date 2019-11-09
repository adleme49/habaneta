import React, { Fragment } from 'react';
import { IonList, IonListHeader, IonLabel } from '@ionic/react';
import CategoryItem from './TilesCategoryItem.component';
import { ITileFamily, IBorderFamily } from '../../../context/interfaces';

const Category: React.FC<{
  title: string;
  tileCat?: ITileFamily[];
  borderCat?: IBorderFamily[];
}> = ({ title, tileCat, borderCat }) => {
  return (
    <Fragment>
      <IonList>
        <IonListHeader>
          <IonLabel>{title}</IonLabel>
        </IonListHeader>
        {tileCat
          ? tileCat.map((item: ITileFamily) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
        {borderCat
          ? borderCat.map((item: IBorderFamily) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
      </IonList>
    </Fragment>
  );
};

export default Category;
