import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import { useStore } from '../store/store';
import { readDesignHash, clearDesignHash } from '../lib/design-url';
import BounceLoader from 'react-spinners/BounceLoader';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { overlay, editingInstance, selectEditingSourceById, applyDesign } =
    useStore();
  const location = useLocation();
  const designApplied = useRef(false);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

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
  // `#d=...` hash. After applying we IMMEDIATELY clear the hash —
  // otherwise navigating away to /library and back would re-trigger
  // the effect on Home's fresh mount and duplicate the restored
  // tiles into extra recent slots, eventually evicting the user's
  // own work.
  useEffect(() => {
    if (designApplied.current) return;
    const design = readDesignHash();
    if (!design) return;
    const { missingSourceIds } = applyDesign(design);
    clearDesignHash();
    designApplied.current = true;
    if (missingSourceIds.length > 0) {
      setRestoreNotice(
        t('preview.sharePartial', { count: missingSourceIds.length })
      );
    } else {
      setRestoreNotice(t('preview.shareRestored'));
    }
    window.setTimeout(() => setRestoreNotice(null), 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <NavLayout />
      <MainLayout />
      {restoreNotice && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg"
          role="status"
          aria-live="polite"
        >
          {restoreNotice}
        </div>
      )}
      {overlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <BounceLoader />
        </div>
      )}
    </div>
  );
};

export default Home;
