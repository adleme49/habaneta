import React, { Fragment, useContext } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import empty from '../../../theme/empty.png';
import GeneralContext from '../../../context/global/general.context';
import { Vgrid } from './grid';

const TileGrid: React.FC = () => {
  const grid = Vgrid;
  const { selectedTile, latestFloor, latestBorder, preview } = useContext(
    GeneralContext
  );
  return (
    <Fragment>
      {selectedTile && preview
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
                      {selectedTile.type === 'Floor' ? (
                        <IonImg
                          src={selectedTile.imgUrl}
                          alt={selectedTile.name}
                        />
                      ) : latestFloor ? (
                        <IonImg
                          src={latestFloor.imgUrl}
                          alt={latestFloor.name}
                        />
                      ) : (
                        <IonImg src={empty} alt={selectedTile.name} />
                      )}
                    </IonCol>
                  ) : (
                    <IonCol
                      key={columna + j}
                      className="ion-no-padding"
                      style={{ border: 'solid 0.1rem' }}
                    >
                      {selectedTile.type === 'Border' ? (
                        <IonImg
                          src={selectedTile.imgUrl}
                          alt={selectedTile.name}
                        />
                      ) : latestBorder ? (
                        <IonImg
                          src={latestBorder.imgUrl}
                          alt={latestBorder.name}
                        />
                      ) : (
                        <IonImg src={empty} alt={selectedTile.name} />
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
