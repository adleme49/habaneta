import React, { Fragment } from 'react';
import { IFloor } from '../../../../context/interfaces';
import { IonCol, IonImg } from '@ionic/react';
import SVGTile from '../../../common/SVGTile.component';
import empty from '../../../../theme/empty.png';
import {
  getTopLeftAngle,
  getTopRightAngle,
  getBottomLeftAngle,
  getBottomRightAngle
} from '../../../../constants/floor';

const FloorGrid: React.FC<{
  orientation: 'TOP' | 'BOTTOM';
  tile?: IFloor;
  grid?: number[];
}> = ({ orientation, tile, grid }) => {
  return (
    <Fragment>
      <IonCol className="ion-no-padding ion-no-margin">
        {tile ? (
          <SVGTile
            check={true}
            tile={tile}
            rotation={
              orientation === 'TOP'
                ? getTopLeftAngle(grid)
                : getBottomLeftAngle(grid)
            }
          />
        ) : (
          <IonImg src={empty} />
        )}
      </IonCol>
      <IonCol className="ion-no-padding ion-no-margin">
        {tile ? (
          <SVGTile
            tile={tile}
            rotation={
              orientation === 'TOP'
                ? getTopRightAngle(grid)
                : getBottomRightAngle(grid)
            }
          />
        ) : (
          <IonImg src={empty} />
        )}
      </IonCol>
    </Fragment>
  );
};

export default FloorGrid;
