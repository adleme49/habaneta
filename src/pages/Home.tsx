import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import LoaderOverlay from '../components/common/Overlay.component';
import { useStore } from '../store/store';

const Home: React.FC = () => {
  const { overlay, editingInstance, selectEditingSourceById } = useStore();
  const location = useLocation();

  // If the URL carries ?tile=<sourceId>, pre-select that tile in the
  // editor. Two guards prevent clobbering an in-progress edit:
  //   - skip if the URL tile is already the one being edited (a
  //     noop navigation shouldn't reset layerOverrides)
  //   - effect deps intentionally only include location.search, so
  //     subsequent editingInstance changes (user picks something
  //     else) don't re-trigger and undo their choice
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tileId = params.get('tile');
    if (!tileId) return;
    if (editingInstance?.sourceId === tileId) return;
    selectEditingSourceById(tileId);
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
