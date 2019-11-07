import React, { useContext } from 'react';
import { IonItem, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
import { Tile, Border } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const TileItem: React.FC<{ type: Tile | Border }> = ({ type }) => {
  const { setCurrentType } = useContext(GeneralContext);
  const handleClick = () => {
    setCurrentType(type);
  };
  return type ? (
    <IonItem detail onClick={handleClick}>
      <IonImg src={Pic102} alt={type.name} />
    </IonItem>
  ) : null;
};

export default TileItem;
