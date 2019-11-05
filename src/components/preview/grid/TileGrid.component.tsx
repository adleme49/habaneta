import React, { Fragment } from 'react';
import { IonRow, IonCol, IonLabel, IonImg } from '@ionic/react';
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
          <IonRow key={i} align-items-center>
            {grid[i].map((columna, j) => {
              return (
                <IonCol key={columna + j}>
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
