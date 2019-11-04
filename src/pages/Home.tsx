import { IonContent, IonPage, IonLoading } from '@ionic/react';
import React, { useState, Fragment } from 'react';
import NavLayaout from '../components/layout/nav/NavLayout.component';
import MainLayaout from '../components/layout/main/MainLayaout.component';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  return (
    <IonPage>
      <NavLayaout />
      {loading ? <IonLoading isOpen={loading} message={'Loading...'} /> : null}
      <Fragment>
        <IonContent className='ion-padding'>
          <MainLayaout />
        </IonContent>
      </Fragment>
    </IonPage>
  );
};

export default Home;
