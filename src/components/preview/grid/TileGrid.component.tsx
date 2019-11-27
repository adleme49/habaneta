import React, { Fragment, useContext } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import empty from '../../../theme/empty.png';
import GeneralContext from '../../../context/global/general.context';
import RecentContext from '../../../context/recent/recent.context';
import { Vgrid } from './grid';
import SVGTile from '../../common/SVGTile.component';

const TileGrid: React.FC = () => {
  const grid = Vgrid;
  const { selectedFloor, selectedBorder } = useContext(RecentContext);
  return (
    <Fragment>
      {selectedFloor || selectedBorder
        ? grid.map((fila, i) => {
            return (
              <IonRow
                key={i}
                align-items-center
                className="ion-no-padding ion-no-margin"
              >
                {grid[i].map((columna, j) => {
                  return columna.includes('floor') ? (
                    <IonCol
                      key={columna + j}
                      className="ion-no-padding"
                      style={{ border: 'solid 0.1rem' }}
                    >
                      {selectedFloor ? (
                        <SVGTile tile={selectedFloor} />
                      ) : (
                        <IonImg src={empty} />
                      )}
                    </IonCol>
                  ) : (
                    <IonCol
                      key={columna + j}
                      className="ion-no-padding"
                      style={{ border: 'solid 0.1rem' }}
                    >
                      {selectedBorder ? (
                        <SVGTile tile={selectedBorder} />
                      ) : (
                        <IonImg src={empty} />
                      )}
                    </IonCol>
                  );
                })}
              </IonRow>
            );
          })
        : grid.map((fila, i) => {
            return (
              <IonRow key={i} className="ion-no-padding ion-no-margin">
                {grid[i].map((columna, j) => {
                  return (
                    <IonCol
                      key={columna + j}
                      className="ion-no-padding ion-no-margin"
                      style={{ border: 'solid 0.09rem ' }}
                    >
                      <IonImg
                        src={empty}
                        alt={'default'}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </IonCol>
                  );
                })}
              </IonRow>
            );
          })}
    </Fragment>
  );
};

export default TileGrid;
