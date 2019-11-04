import React, { Fragment } from 'react';
import { IonList, IonListHeader, IonLabel, IonItem } from '@ionic/react';
import TilesCategoryItem from './TilesCategoryItem.component';

const TilesCategory: React.FC<{ title: string }> = ({ title }) => {
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
        {items.map(item => (
          <TilesCategoryItem key={item} categoryItem={item} />
        ))}
      </IonList>
    </Fragment>
  );
};

export default TilesCategory;
