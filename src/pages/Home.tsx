import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import LoaderOverlay from '../components/common/Overlay.component';
import { useStore } from '../store/store';

const Home: React.FC = () => {
  const { overlay, selectEditingSourceById } = useStore();
  const location = useLocation();

  // If the URL carries ?tile=<sourceId>, pre-select that tile in the
  // editor on mount (e.g. from a click-through on the /library page).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tileId = params.get('tile');
    if (tileId) {
      selectEditingSourceById(tileId);
    }
    // We intentionally only read the query once per navigation event —
    // re-running when selectEditingSourceById rebinds would re-select
    // the tile every time the library array changes and discard the
    // user's in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="min-h-screen bg-white">
      <LoaderOverlay active={overlay}>
        <NavLayout />
        <MainLayout />
      </LoaderOverlay>
    </div>
  );
};

export default Home;
