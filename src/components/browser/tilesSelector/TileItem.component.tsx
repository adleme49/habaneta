import React, { useContext } from 'react';
import { IonItem, IonImg } from '@ionic/react';
import Default from '../../../theme/102.png';
import { IFloor, IBorder } from '../../../context/interfaces';
import EditorContext from '../../../context/editor/editor.context';
import GeneralContext from '../../../context/global/general.context';

const TileItem: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  const { disableRecent } = useContext(GeneralContext) as any ;
  const { setTile } = useContext(EditorContext) as any;

  const handleClick = () => {
    disableRecent()
    setTile(tile);
  };
  return tile ? (
    <IonItem onClick={handleClick}>
      <IonImg src={tile.imgUrl ? tile.imgUrl : Default} alt={tile.name} />
    </IonItem>
  ) : null;
};

export default TileItem;
