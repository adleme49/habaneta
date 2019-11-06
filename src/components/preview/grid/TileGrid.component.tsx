import React, { Fragment } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
const TileGrid: React.FC = () => {
  const grid = [
    [
      'border top left',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border top right'
    ],
    [
      'border',
      'floor top left',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor top right',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'border'
    ],
    [
      'border bottom left',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border',
      'border bottom right'
    ]
  ];
  return (
    <Fragment>
      {grid.map((fila, i) => {
        return (
          <IonRow key={i} align-items-center style={{ padding: '0px' }}>
            {grid[i].map((columna, j) => {
              return (
                <IonCol
                  key={columna + j}
                  style={{ padding: '0px', border: 'solid 0.8px' }}
                >
                  <IonImg src={Pic102} />
                  {/* <IonLabel class='ion-text-wrap'>{columna}</IonLabel> */}
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
