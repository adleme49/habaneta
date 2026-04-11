import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import { useStore } from '../store/store';
import BounceLoader from 'react-spinners/BounceLoader';

const Home: React.FC = () => {
  const { overlay, editingInstance, selectEditingSourceById } = useStore();
  const location = useLocation();

  // If the URL carries ?tile=<sourceId>, pre-select that tile in the
  // editor. Skip if the same tile is already being edited to avoid
  // clobbering in-progress overrides.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tileId = params.get('tile');
    if (!tileId) return;
    if (editingInstance?.sourceId === tileId) return;
    selectEditingSourceById(tileId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <NavLayout />
      <MainLayout />
      {overlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <BounceLoader />
        </div>
      )}
    </div>
  );
};

export default Home;
