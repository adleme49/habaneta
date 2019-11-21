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
              <IonRow key={i} align-items-center className="ion-no-padding">
                {grid[i].map((columna, j) => {
                  return columna.includes('floor') ? (
                    <IonCol
                      key={columna + j}
                      style={{ padding: '0px', border: 'solid 0.8px' }}
                    >
                      {selectedTile.type === 'Floor' ? (
                        <IonImg
                          src={selectedTile.imgUrl}
                          alt={selectedTile.name}
                        />
                      ) : latestFloor !== !null ? (
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
                      style={{ padding: '0px', border: 'solid 0.8px' }}
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
              <IonRow key={i} align-items-center style={{ padding: '0px' }}>
                {grid[i].map((columna, j) => {
                  return (
                    <IonCol
                      key={columna + j}
                      style={{ padding: '0px', border: 'solid 0.8px' }}
                    >
                      <IonImg src={empty} alt={'default'} />
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
