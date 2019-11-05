import React, { Fragment } from 'react';
import { IonList } from '@ionic/react';
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
