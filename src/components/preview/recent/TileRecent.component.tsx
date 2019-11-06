import React, { Fragment } from 'react';
import { IonCol, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
const TileRecent: React.FC = () => {
  const recentTiles = [1, 2, 3, 4, 5];
  return (
    <Fragment>
      {recentTiles.map(tile => {
        return (
          <IonCol key={tile}>
            <IonImg src={Pic102} />
          </IonCol>
        );
      })}
    </Fragment>
  );
};

export default TileRecent;
