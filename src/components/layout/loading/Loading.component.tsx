import React from 'react';
import { IonLoading } from '@ionic/react';

const Loading: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  return <IonLoading isOpen={loading} message={'Loading...'} />;
};

export default Loading;
