import { IonCol, IonImg, IonRow } from '@ionic/react';
import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import empty from '../../../../theme/empty.png';
import SVGTile from '../../../common/SVGTile.component';
import FloorGrid from './FloorGrid.component';

const Body: React.FC<{
  borderTile?: IBorder;
  floorTile?: IFloor;
  grid?: number[];
}> = ({ borderTile, floorTile,grid }) => {
  return (
    <Fragment>
      <IonRow className="ion-no-padding ion-no-margin">
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid}/>
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid}/>
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid}/>
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
      </IonRow>
      <IonRow className="ion-no-padding ion-no-margin">
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default Body;
