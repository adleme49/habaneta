import React from 'react';
import { IonToast } from '@ionic/react';

const Toast: React.FC<{
  showToast?: boolean;
  message?: string;
  duration?: number;
}> = ({ showToast = false, message = 'Default Message', duration = 2000 }) => {
  return <IonToast isOpen={showToast} message={message} duration={duration} />;
};

export default Toast;
