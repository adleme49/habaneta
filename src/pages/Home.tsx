import { IonContent, IonPage } from '@ionic/react';
import React, { Fragment, useState, useContext } from 'react';
import Loading from '../components/layout/loading/Loading.component';
import MainLayaout from '../components/layout/main/MainLayaout.component';
import NavLayaout from '../components/layout/nav/NavLayout.component';
import Toast from '../components/layout/toast/Toast.component';
import GeneralContext from '../context/global/general.context';

const Home: React.FC = () => {
  const { loading } = useContext(GeneralContext);
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
