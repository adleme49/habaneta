import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const Loading: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <BounceLoader />
    </div>
  ) : null;
};

export default Loading;
