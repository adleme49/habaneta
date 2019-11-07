import { IonImg } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import border from '../../../theme/border.png';

const TileEditor: React.FC = () => {
  const { selectedType } = useContext(GeneralContext);
  return (
    <Fragment>
      {selectedType !== null ? (
        <IonImg src={border} alt={selectedType.name} />
      ) : null}
    </Fragment>
  );
};

export default TileEditor;
