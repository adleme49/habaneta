import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import { useStore } from '../store/store';
import { readDesignHash } from '../lib/design-url';
import BounceLoader from 'react-spinners/BounceLoader';

const Home: React.FC = () => {
  const { overlay, editingInstance, selectEditingSourceById, applyDesign } =
    useStore();
  const location = useLocation();
  const designApplied = useRef(false);

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

  // Restore a shared design on first mount if the URL carries a
  // `#d=...` hash. Guarded by a ref so the effect doesn't re-fire
  // and spam duplicate recent slots if the component remounts.
  useEffect(() => {
    if (designApplied.current) return;
    const design = readDesignHash();
    if (design) {
      applyDesign(design);
      designApplied.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
