import React, { Fragment, useContext } from 'react';
import { IonCol, IonImg, IonBadge } from '@ionic/react';
import Default from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index
}) => {
  const { setCurrentTilefromRecent, deleteRecent } = useContext(
    GeneralContext
  ) as any;

  const handleDelete = () => {
    deleteRecent(index);
  };
  const onSetCurrentTilefromRecent = () => {
    setCurrentTilefromRecent(tile);
  };

  return (
    <Fragment>
      <IonCol>
        {tile.imgUrl ? (
          <IonImg
            src={tile.imgUrl}
            alt={tile.name}
            onClick={onSetCurrentTilefromRecent}
          />
        ) : (
          <IonImg src={Default} alt={tile.name} />
        )}

        <IonBadge
          onClick={handleDelete}
          style={{
            display: 'flex',
            position: 'absolute',
            top: '0px',
            right: '0px'
          }}
          color="danger"
        >
          X
        </IonBadge>
      </IonCol>
    </Fragment>
  );
};

export default TileRecentItem;
