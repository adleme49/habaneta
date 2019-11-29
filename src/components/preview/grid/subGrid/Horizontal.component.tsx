import React, { Fragment } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import { IBorder } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';
import ReactDOM from 'react-dom';

const vhorizontal = [1, 2, 3, 4, 5, 6];
const Horizontal: React.FC<{
  orientation: 'TOP' | 'BOTTOM';
  tile: IBorder;
}> = ({ orientation, tile }) => {
  return (
    <Fragment>
      <IonRow className="ion-no-padding ion-no-margin">
        <IonCol className="ion-no-padding ion-no-margin">
          {tile ? (
            <SVGTile
              check={true}
              tile={tile}
              url={tile.cornerUrl}
              rotation={orientation === 'TOP' ? 0 : -90}
            />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
        {vhorizontal.map((_: number) => (
          <IonCol className="ion-no-padding ion-no-margin" key={_}>
            {tile ? (
              <SVGTile tile={tile} rotation={orientation === 'TOP' ? 0 : 180} />
            ) : (
              <IonImg src={empty} />
            )}
          </IonCol>
        ))}
        <IonCol className="ion-no-padding ion-no-margin">
          {tile ? (
            <SVGTile
              tile={tile}
              url={tile.cornerUrl}
              rotation={orientation === 'TOP' ? 90 : 180}
            />
          ) : (
            <IonImg src={empty} />
          )}
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default Horizontal;
