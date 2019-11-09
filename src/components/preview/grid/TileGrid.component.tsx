import React, { Fragment, useContext } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import empty from '../../../theme/empty.png';
import floor from '../../../theme/floor.png';
import border from '../../../theme/border.png';
import GeneralContext from '../../../context/global/general.context';
import { Vgrid } from './grid';

const TileGrid: React.FC = () => {
  const grid = Vgrid;
  const { selectedType, preview } = useContext(GeneralContext);
  return (
    <Fragment>
      {selectedType !== null && preview
        ? grid.map((fila, i) => {
            return (
              <IonRow key={i} align-items-center className='ion-no-padding'>
                {grid[i].map((columna, j) => {
                  return columna.includes('floor') ? (
                    <IonCol
                      key={columna + j}
                      style={{ padding: '0px', border: 'solid 0.8px' }}
                    >
                      <IonImg src={floor} alt={selectedType.name} />
                    </IonCol>
                  ) : (
                    <IonCol
                      key={columna + j}
                      style={{ padding: '0px', border: 'solid 0.8px' }}
                    >
                      <IonImg src={border} />
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
