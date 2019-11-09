import React, { Fragment, useContext } from 'react';
import { IonList } from '@ionic/react';
import TileItem from './TileItem.component';
import GeneralContext from '../../../context/global/general.context';
import { IBorder, IFloor } from '../../../context/interfaces';

const TilesSelector: React.FC = () => {
  const { selectedCategory } = useContext(GeneralContext);

  return (
    <Fragment>
      {selectedCategory !== null ? (
        <IonList>
          {selectedCategory.types.map((type: IFloor | IBorder) => (
            <TileItem key={type.name} type={type} />
          ))}
        </IonList>
      ) : null}
    </Fragment>
  );
};

export default TilesSelector;
