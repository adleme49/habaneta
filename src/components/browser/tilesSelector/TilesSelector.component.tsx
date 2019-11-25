import React, { Fragment, useContext } from 'react';
import { IonList, IonContent } from '@ionic/react';
import TileItem from './TileItem.component';
import GeneralContext from '../../../context/global/general.context';
import { IBorder, IFloor } from '../../../context/interfaces';

const TilesSelector: React.FC = () => {
  const { selectedFamily } = useContext(GeneralContext) as any;

  return (
    <Fragment>
      {selectedFamily ? (
        <IonContent scrollX style={{ height: '750px' }}>
          <IonList inset={true}>
            {selectedFamily.types.map((tile: IFloor | IBorder) => (
              <TileItem key={tile.name} tile={tile} />
            ))}
          </IonList>
        </IonContent>
      ) : null}
    </Fragment>
  );
};

export default TilesSelector;
