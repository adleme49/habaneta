import { IonCol, IonImg, IonBadge } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import { IBorder, IFloor } from '../../../context/interfaces';
import empty from '../../../theme/empty.png';
import TileRecentItem from './TileRecentItem.component';

const TileRecent: React.FC = () => {
  const { recentsUsed } = useContext(GeneralContext);

  return (
    <Fragment>
      {recentsUsed
        ? recentsUsed.map((tile: IBorder | IFloor, index: number) => {
            return !tile.name.includes('empty') ? (
              <TileRecentItem tile={tile} key={index} index={index} />
            ) : (
              <IonCol key={index}>
                <IonImg src={empty} />
              </IonCol>
            );
          })
        : null}
    </Fragment>
  );
};

export default TileRecent;
