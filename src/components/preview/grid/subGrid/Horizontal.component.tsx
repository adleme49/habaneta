import React, { Fragment } from 'react';
import { IonRow, IonCol, IonImg } from '@ionic/react';
import { IBorder } from '../../../../context/interfaces';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';

const vhorizontal = [1, 2, 3, 4, 5, 6, 7, 8];
const Horizontal: React.FC<{
  orientation: 'TOP' | 'BOTTOM';
  tile: IBorder;
}> = ({ orientation, tile }) => {
  return (
    <Fragment>
      <IonRow className="ion-no-padding ion-no-margin">
        {vhorizontal.map((_: number) => (
          <IonCol className="ion-no-padding ion-no-margin" key={_}>
            {tile ? <SVGTile tile={tile} /> : <IonImg src={empty} />}
          </IonCol>
        ))}
      </IonRow>
    </Fragment>
  );
};

export default Horizontal;
