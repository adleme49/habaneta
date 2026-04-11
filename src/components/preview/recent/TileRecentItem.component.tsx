import React, { useMemo } from 'react';
import { TileInstance, findSource, resolveTile } from '../../../lib/library';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

const TileRecentItem: React.FC<{ instance: TileInstance; index: number }> = ({
  instance,
  index,
}) => {
  const { library, selectRecent, deleteRecent, editingIndex } = useStore();
  const isActive = editingIndex === index;

  const resolved = useMemo(() => {
    const source = findSource(library, instance.sourceId);
    return source ? resolveTile(source, instance) : undefined;
  }, [library, instance]);

  if (!resolved) return null;

  return (
    <div
      className={`relative w-14 h-14 flex-shrink-0 overflow-hidden rounded cursor-pointer ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => selectRecent(index)}
    >
      <SVGTileBase tile={resolved} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteRecent(index);
        }}
        className="absolute top-0 right-0 bg-red-500 text-white text-[10px] leading-none w-4 h-4 flex items-center justify-center cursor-pointer"
      >
        ×
      </button>
    </div>
  );
};

export default TileRecentItem;
