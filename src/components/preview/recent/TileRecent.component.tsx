import { IonCol, IonImg, IonBadge, IonItem } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import { Border, Tile } from '../../../context/interfaces';
import Pic102 from '../../../theme/102.png';
import empty from '../../../theme/empty.png';

const TileRecent: React.FC = () => {
  const { recentUsed } = useContext(GeneralContext);
  const fixedRecent = [1, 2, 3, 4, 5];
  const handleDelete = () => {
    console.log('deletePresed');
  };

  return (
    <Fragment>
      {recentUsed
        ? recentUsed.map((tile: Border | Tile, index: number) => {
            return !tile.name.includes('empty') ? (
              <IonCol key={index}>
                <IonImg src={Pic102} alt={tile.name} />
                <IonBadge
                  onClick={handleDelete}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '0px',
                    right: '0px'
                  }}
                  color='danger'
                >
                  X
                </IonBadge>
              </IonCol>
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
