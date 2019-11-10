import React, { Fragment, useContext } from 'react';
import { IonCol, IonImg, IonBadge } from '@ionic/react';
import Pic102 from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index
}) => {
  const { deleteRecent } = useContext(GeneralContext);

  const handleDelete = () => {
    deleteRecent(index);
  };
  return (
    <Fragment>
      <IonCol>
        <IonImg src={Pic102} alt={tile.name} />
        <IonBadge
          onClick={handleDelete}
          style={{
            display: 'flex',
            position: 'absolute',
            top: '0px',
            right: '0px'
          }}
          color='danger'
        >
          X
        </IonBadge>
      </IonCol>
    </Fragment>
  );
};

export default TileRecentItem;
