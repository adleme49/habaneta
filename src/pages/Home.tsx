import { IonContent, IonPage, IonLoading } from '@ionic/react';
import React, { useState, Fragment } from 'react';
import NavLayaout from '../components/layout/nav/NavLayout.component';
import MainLayaout from '../components/layout/main/MainLayaout.component';
import Loading from '../components/layout/loading/Loading.component';
import Toast from '../components/layout/toast/Toast.component';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  return (
    <IonPage>
      <NavLayaout />
      {loading ? <Loading loading={loading} /> : null}
      {showToast ? <Toast showToast={showToast} /> : null}
      <Fragment>
        <IonContent className='ion-padding'>
          <MainLayaout />
        </IonContent>
      </Fragment>
    </IonPage>
  );
};

export default Home;
