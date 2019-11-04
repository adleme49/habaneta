import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import NavLayaout from '../components/layout/nav/NavLayout.component';
import MainLayaout from '../components/layout/main/MainLayaout.component';

const Home: React.FC = () => {
  return (
    <IonPage>
      <NavLayaout />
      <IonContent className='ion-padding'>
        <MainLayaout />
      </IonContent>
    </IonPage>
  );
};

export default Home;
