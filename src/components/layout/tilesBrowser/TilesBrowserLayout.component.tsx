import React, { Fragment, useContext } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import Category from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';
import GeneralContext from '../../../context/global/general.context';
import { IGeneralState } from '../../../context/interfaces';

const TilesBrowserLayout: React.FC = () => {
  const { tilesCategory, borderCategory } = useContext<Partial<IGeneralState>>(
    GeneralContext
  );

  return (
    <Fragment>
      <IonRow>
        <h2>Buscador de Lozas</h2>
      </IonRow>
      <IonRow align-self-start>
        <IonCol size='7'>
          <Category title={'TILES'} tileCat={tilesCategory} />
          <Category title={'BORDER'} borderCat={borderCategory} />
        </IonCol>
        <IonCol>
          <TilesSelector />
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TilesBrowserLayout;
