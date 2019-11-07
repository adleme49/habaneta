import React, { Fragment, useContext } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
import floor from '../../../theme/floor.png';
import border from '../../../theme/border.png';
import GeneralContext from '../../../context/global/general.context';
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
  const { selectedType } = useContext(GeneralContext);
  return (
    <Fragment>
      {selectedType !== null
        ? grid.map((fila, i) => {
            return (
              <IonRow key={i} align-items-center style={{ padding: '0px' }}>
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
                      <IonImg src={Pic102} alt={'default'} />
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
