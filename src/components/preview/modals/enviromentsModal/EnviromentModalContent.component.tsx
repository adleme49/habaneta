import React, { Fragment } from 'react';
import { IonToolbar, IonTitle } from '@ionic/react';

const EnviromentModalContent: React.FC = () => {
  return (
    <Fragment>
      <IonToolbar color="primary">
        <IonTitle>Enviroments</IonTitle>
      </IonToolbar>
    </Fragment>
  );
};

export default EnviromentModalContent;
