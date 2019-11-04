import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Nav from '../components/layout/nav/Nav.component';
import MainLayaout from '../components/layout/main/MainLayaout.component';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Nav />
      <IonContent className='ion-padding'>
        <MainLayaout />
      </IonContent>
    </IonPage>
  );
};

export default Home;
