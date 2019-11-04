import React, { Fragment } from 'react';
import { IonItem, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';

const TileItem: React.FC<{ tile?: string }> = ({ tile = Pic102 }) => {
  return (
    <Fragment>
      <IonItem>
        <IonImg src={tile} />
      </IonItem>
    </Fragment>
  );
};

export default TileItem;
