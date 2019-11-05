import React, { Fragment, useContext } from 'react';
import { IonList } from '@ionic/react';
import TileItem from './TileItem.component';
import GeneralContext from '../../../context/global/general.context';

const TilesSelector: React.FC = () => {
  const { selectedCategory } = useContext(GeneralContext);
  const tiles = ['a', 'b', 'c'];
  return (
    <Fragment>
      {selectedCategory !== null ? (
        <IonList>
          {tiles.map(tile => (
            <TileItem key={tile} />
          ))}
        </IonList>
      ) : null}
    </Fragment>
  );
};

export default TilesSelector;
