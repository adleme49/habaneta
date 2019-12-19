import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import LoadingOverlay from 'react-loading-overlay';

const LoaderOverlay: React.FC<{
  active: boolean;
}> = ({ active, children }) => (
  <LoadingOverlay active={active} spinner={<BounceLoader />}>
    {children}
  </LoadingOverlay>
);

export default LoaderOverlay;
