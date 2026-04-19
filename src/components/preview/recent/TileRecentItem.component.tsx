import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TileInstance, findSource, resolveTile } from '../../../lib/library';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

/**
 * A single recent thumbnail. The design distinguishes three states:
 *  - **editing**: the tile is currently loaded in the editor (ring).
 *  - **on-grid**: the tile is currently rendered on the floor/border
 *    (small filled dot in the top-left corner).
 *  - **neither**: plain thumbnail.
 *
 * The role ("F" or "B") is shown as a subtle corner badge so the
 * user can tell floors apart from borders without needing a label.
 * Delete is hover/focus-revealed via `group-hover:` / `focus-within:`
 * to reduce visual noise on the resting row.
 */
const TileRecentItem: React.FC<{
  instance: TileInstance;
  index: number;
  role: 'floor' | 'border';
}> = ({ instance, index, role }) => {
  const { t } = useTranslation();
  const {
    library,
    selectRecent,
    deleteRecent,
    editingIndex,
    floorIndex,
    borderIndex,
  } = useStore();

  const source = useMemo(
    () => findSource(library, instance.sourceId),
    [library, instance.sourceId]
  );
  const resolved = useMemo(
    () => (source ? resolveTile(source, instance) : undefined),
    [source, instance]
  );
  if (!resolved || !source) return null;

  const isEditing = editingIndex === index;
  const isOnGrid = role === 'floor' ? floorIndex === index : borderIndex === index;
  const title = `${source.displayName} · ${source.family} · ${t(
    role === 'floor' ? 'preview.roleFloor' : 'preview.roleBorder'
  )}`;

  return (
    <div
      className={`group relative w-14 h-14 flex-shrink-0 overflow-hidden rounded cursor-pointer bg-white
        ${isEditing ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 hover:ring-gray-400'}
        focus-within:ring-2 focus-within:ring-blue-500`}
      onClick={() => selectRecent(index)}
      title={title}
    >
      <SVGTileBase tile={resolved} style={{ width: '100%', height: '100%' }} />

      {/* Active-on-grid indicator (distinct from editing ring). */}
      {isOnGrid && (
        <span
          aria-label={t('preview.onGrid')}
          className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white"
        />
      )}

      {/* Role badge — F for floor, B for border. */}
      <span
        aria-hidden
        className="absolute bottom-0.5 left-0.5 text-[9px] font-semibold leading-none px-1 py-0.5 rounded bg-white/85 text-gray-600"
      >
        {role === 'floor' ? 'F' : 'B'}
      </span>

      {/* Delete — hover/focus reveal only, neutral color. */}
      <button
        type="button"
        aria-label={t('preview.removeRecent')}
        onClick={(e) => {
          e.stopPropagation();
          deleteRecent(index);
        }}
        className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-gray-500 bg-white/85 rounded-bl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden
          className="stroke-current"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 2 L8 8 M8 2 L2 8" />
        </svg>
      </button>
    </div>
  );
};

export default TileRecentItem;
