import { IonCol, IonImg, IonRow } from '@ionic/react';
import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import empty from '../../../../theme/empty.png';
import SVGTile from '../../../common/SVGTile.component';
import FloorGrid from './FloorGrid.component';

const DoubleBody: React.FC<{
  borderTile: IBorder | undefined;
  floorTile: IFloor | undefined;
}> = ({ borderTile, floorTile }) => {
  return (
    <Fragment>
      <IonRow className="ion-no-padding ion-no-margin">
        <FloorGrid tile={floorTile} orientation={'TOP'} />
        <FloorGrid tile={floorTile} orientation={'TOP'} />
        <FloorGrid tile={floorTile} orientation={'TOP'} />
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
      </IonRow>
      <IonRow className="ion-no-padding ion-no-margin">
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} />
        <IonCol className="ion-no-padding ion-no-margin">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
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

export default DoubleBody;
