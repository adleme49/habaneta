import { IonPage } from '@ionic/react';
import React, { useContext, useState } from 'react';
import Loading from '../components/layout/loading/Loading.component';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayaout from '../components/layout/nav/NavLayout.component';
import Toast from '../components/layout/toast/Toast.component';
import GeneralContext from '../context/global/general.context';

const Home: React.FC = () => {
  const { loading } = useContext(GeneralContext);
  const [showToast] = useState(false);

  return (
    <IonPage>
      <NavLayaout />
      {loading ? <Loading loading={loading} /> : null}
      {showToast ? <Toast showToast={showToast} /> : null}
      <MainLayout />
    </IonPage>
  );
};

export default Home;
