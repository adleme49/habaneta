import React, { Fragment, useContext } from 'react';
import { IonList, IonContent } from '@ionic/react';
import TileItem from './TileItem.component';
import GeneralContext from '../../../context/global/general.context';
import { IBorder, IFloor } from '../../../context/interfaces';

const TilesSelector: React.FC = () => {
  const { selectedFamily } = useContext(GeneralContext);

  return (
    <Fragment>
      {selectedFamily !== null ? (
        <IonContent scrollX style={{ height: '100%' }}>
          <IonList>
            {selectedFamily.types.map((type: IFloor | IBorder) => (
              <TileItem key={type.name} type={type} />
            ))}
          </IonList>
        </IonContent>
      ) : null}
    </Fragment>
  );
};

export default TilesSelector;
