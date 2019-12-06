import React, { Fragment, useContext } from 'react';
import { IonCol, IonImg, IonBadge } from '@ionic/react';
import Default from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import RecentContext from '../../../context/recent/recent.context';
import SVGTile from '../../common/SVGTile.component';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index
}) => {
  const { selectLatest, deleteRecent } = useContext(RecentContext);

  const handleDelete = () => {
    deleteRecent(index);
  };
  const onSetCurrentTilefromRecent = () => {
    selectLatest(index);
  };

  return (
    <Fragment>
      <IonCol>
        {tile.layers ? (
          <SVGTile tile={tile} onClickHandler={onSetCurrentTilefromRecent} />
        ) : tile.imgUrl ? (
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
            right: '0px',
            transform: 'scale(2)',
            zIndex: 2
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
