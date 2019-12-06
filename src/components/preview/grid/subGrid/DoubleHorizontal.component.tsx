import React, { Fragment } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import { IBorder } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';

const horizontal1 = [1, 2, 3, 4, 5, 6, 7, 8];
const DoubleHorizontal: React.FC<{
  tile: IBorder | undefined;
}> = ({ tile }) => {
  return (
    <Fragment>
      <IonRow className="ion-no-padding ion-no-margin">
        {horizontal1.map((column: number) =>
          column === 8 ? (
            <IonCol className="ion-no-padding ion-no-margin" key={column}>
              {tile ? (
                <SVGTile check={true} tile={tile} url={tile.cornerUrl} rotation={90} />
              ) : (
                <IonImg src={empty} />
              )}
            </IonCol>
          ) : (
            <IonCol className="ion-no-padding ion-no-margin" key={column}>
              {tile ? (
                <SVGTile tile={tile} rotation={0} />
              ) : (
                <IonImg src={empty} />
              )}
            </IonCol>
          )
        )}
      </IonRow>
      <IonRow className="ion-no-padding ion-no-margin">
        {horizontal1.map((column: number) =>
          column === 7 ? (
            <IonCol className="ion-no-padding ion-no-margin" key={column}>
              {tile ? (
                <SVGTile
                  tile={tile}
                  url={tile.cornerInteriorUrl}
                  rotation={90}
                />
              ) : (
                <IonImg src={empty} />
              )}
            </IonCol>
          )  : column === 8 ? (
            <IonCol className="ion-no-padding ion-no-margin" key={column}>
              {tile ? (
                <SVGTile
                  tile={tile}
                  rotation={90}
                />
              ) : (
                <IonImg src={empty} />
              )}
            </IonCol>
          )  : (
            <IonCol className="ion-no-padding ion-no-margin" key={column}>
              {tile ? (
                <SVGTile tile={tile} rotation={180} />
              ) : (
                <IonImg src={empty} />
              )}
            </IonCol>
          )
        )}
      </IonRow>
    </Fragment>
  );
};

export default DoubleHorizontal;
