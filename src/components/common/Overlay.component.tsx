import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const LoaderOverlay: React.FC<{
  active: boolean;
  children?: React.ReactNode;
}> = ({ active, children }) => (
  <div style={{ position: 'relative' }}>
    {active && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <BounceLoader />
      </div>
    )}
    {children}
  </div>
);

export default LoaderOverlay;
