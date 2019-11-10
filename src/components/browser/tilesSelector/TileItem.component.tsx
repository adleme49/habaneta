import React, { useContext } from 'react';
import { IonItem, IonImg } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
import { IFloor, IBorder } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const TileItem: React.FC<{ type: IFloor | IBorder }> = ({ type }) => {
  const { setCurrentTile } = useContext(GeneralContext);
  const handleClick = () => {
    setCurrentTile(type);
  };
  return type ? (
    <IonItem onClick={handleClick}>
      <IonImg src={Pic102} alt={type.name} />
    </IonItem>
  ) : null;
};

export default TileItem;
