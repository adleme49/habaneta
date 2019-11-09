import React, { Fragment } from 'react';
import { IonList, IonListHeader, IonLabel } from '@ionic/react';
import CategoryItem from './TilesCategoryItem.component';
import { ITileFamily, IBorderFamily } from '../../../context/interfaces';

const Category: React.FC<{
  title: string;
  tileFamilys?: ITileFamily[];
  borderFamilys?: IBorderFamily[];
}> = ({ title, tileFamilys, borderFamilys }) => {
  return (
    <Fragment>
      <IonList>
        <IonListHeader>
          <IonLabel>{title}</IonLabel>
        </IonListHeader>
        {tileFamilys
          ? tileFamilys.map((item: ITileFamily) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
        {borderFamilys
          ? borderFamilys.map((item: IBorderFamily) => (
              <CategoryItem key={item.name} categoryItem={item} />
            ))
          : null}
      </IonList>
    </Fragment>
  );
};

export default Category;
