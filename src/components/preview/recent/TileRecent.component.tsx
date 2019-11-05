import React, { Fragment } from 'react';
import { IonCol } from '@ionic/react';
import TileItem from '../../browser/tilesSelector/TileItem.component';

const TileRecent: React.FC = () => {
  const recentTiles = [1, 2, 3, 4];
  return (
    <Fragment>
      {recentTiles.map(tile => {
        return (
          <IonCol key={tile} size='3'>
            <TileItem />
          </IonCol>
        );
      })}
    </Fragment>
  );
};

export default TileRecent;
