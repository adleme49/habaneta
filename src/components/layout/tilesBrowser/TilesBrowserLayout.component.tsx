import { IonCol, IonRow } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

const TilesBrowserLayout: React.FC = () => {
  const { tilesFamilys, borderFamilys } = useContext(GeneralContext);

  return (
    <Fragment>
      <IonRow>
        <h2>Buscador de Lozas</h2>
      </IonRow>
      <IonRow align-self-start>
        <IonCol size="7">
          <Category title={'TILES'} tileFamilys={tilesFamilys} />
          <Category title={'BORDER'} borderFamilys={borderFamilys} />
        </IonCol>
        <IonCol>
          <TilesSelector />
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TilesBrowserLayout;
