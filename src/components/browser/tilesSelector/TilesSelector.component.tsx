import React, { Fragment } from 'react';
import { IonCard, IonItem, IonList, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
import TileItem from './TileItem.component';
const TilesSelector: React.FC = () => {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <Fragment>
      <IonList>
        {tiles.map(tile => (
          <TileItem key={tile} />
        ))}
      </IonList>
    </Fragment>
  );
};

export default TilesSelector;
