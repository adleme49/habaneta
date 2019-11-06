import { IonCol, IonImg } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import { Border, Tile } from '../../../context/interfaces';
import Pic102 from '../../../theme/102.png';
import empty from '../../../theme/empty.png';
const TileRecent: React.FC = () => {
  const { recentsUsed } = useContext(GeneralContext);
  const fixedRecent = [1, 2, 3, 4, 5];

  return (
    <Fragment>
      {recentsUsed !== null
        ? recentsUsed.map((tile: Border | Tile) => {
            return (
              <IonCol key={tile.name}>
                <IonImg src={Pic102} />
              </IonCol>
            );
          })
        : fixedRecent.map(tile => {
            return (
              <IonCol key={tile}>
                <IonImg src={empty} />
              </IonCol>
            );
          })}
    </Fragment>
  );
};

export default TileRecent;
