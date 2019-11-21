import React, { useContext } from 'react';
import { IonItem, IonImg } from '@ionic/react';
import Default from '../../../theme/102.png';
import { IFloor, IBorder } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const TileItem: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  const { setCurrentTile } = useContext(GeneralContext);

  const handleClick = () => {
    setCurrentTile(tile);
  };
  return tile ? (
    <IonItem onClick={handleClick}>
      {tile.imgUrl ? (
        <IonImg src={tile.imgUrl} alt={tile.name} />
      ) : (
        <IonImg src={Default} alt={tile.name} />
      )}
    </IonItem>
  ) : null;
};

export default TileItem;
