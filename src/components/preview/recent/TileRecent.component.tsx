import { IonCol, IonImg } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import { IBorder, IFloor } from '../../../context/interfaces';
import empty from '../../../theme/empty.png';
import TileRecentItem from './TileRecentItem.component';
import RecentContext from '../../../context/recent/recent.context';

const TileRecent: React.FC = () => {
  const { recent } = useContext(RecentContext);

  return (
    <Fragment>
      {recent
        ? recent.map((tile: IBorder | IFloor, index: number) => {
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
