import React, { Fragment } from 'react';
import { IBorder } from '../../../../context/interfaces';
import { IonCol, IonImg } from '@ionic/react';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';

const FloorGrid: React.FC<{ orientation: 'TOP' | 'BOTTOM'; tile: IBorder }> = ({
  orientation,
  tile
}) => {
  return (
    <Fragment>
      <IonCol className="ion-no-padding ion-no-margin">
        {tile ? (
          <SVGTile
            check={true}
            tile={tile}
            rotation={orientation === 'TOP' ? 450 : 720}
          />
        ) : (
          <IonImg src={empty} />
        )}
      </IonCol>
      <IonCol className="ion-no-padding ion-no-margin">
        {tile ? (
          <SVGTile tile={tile} rotation={orientation === 'TOP' ? 180 : 990} />
        ) : (
          <IonImg src={empty} />
        )}
      </IonCol>
    </Fragment>
  );
};

export default FloorGrid;
