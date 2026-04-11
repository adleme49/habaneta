import React, { useMemo, useState } from 'react';
import { useStore } from '../../../store/store';
import { findSource, TilePreset } from '../../../lib/library';
import { Button } from '@/components/ui/button';

/**
 * Preset chips + save-as control, shown below the tile in the editor.
 * Hidden when no tile is being edited.
 *
 * Each chip previews the preset's full resolved palette (source
 * defaults ⊕ overrides) as a row of small swatches, followed by the
 * name and a delete button. Clicking the chip applies the preset.
 */
const Presets: React.FC = () => {
  const {
    editingInstance,
    presetsForEditing,
    library,
    savePreset,
    applyPreset,
    deletePreset,
  } = useStore();

  const [isNaming, setIsNaming] = useState(false);
  const [name, setName] = useState('');

  if (!editingInstance) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    savePreset(name);
    setName('');
    setIsNaming(false);
  };

  return (
    <div className="pt-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Presets
        </h3>
        {!isNaming && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNaming(true)}
          >
            Save as preset
          </Button>
        )}
      </div>

      {isNaming && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setIsNaming(false);
                setName('');
              }
            }}
            placeholder="Preset name…"
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsNaming(false);
              setName('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {presetsForEditing.length === 0 ? (
        <p className="text-xs text-gray-400">
          No presets yet for this tile.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {presetsForEditing.map((preset) => (
            <PresetChip
              key={preset.id}
              preset={preset}
              sourceLayers={
                findSource(library, preset.sourceId)?.layers ?? {}
              }
              onApply={() => applyPreset(preset)}
              onDelete={() => deletePreset(preset.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * A single preset chip: swatches + name + delete.
 *
 * Swatches show the preset's *resolved* palette, not just the
 * overrides — that way the chip reflects what the tile will look
 * like after applying, regardless of how many layers were changed.
 */
const PresetChip: React.FC<{
  preset: TilePreset;
  sourceLayers: Record<string, string>;
  onApply: () => void;
  onDelete: () => void;
}> = ({ preset, sourceLayers, onApply, onDelete }) => {
  const swatches = useMemo(() => {
    // Merge source defaults with overrides so the chip represents
    // the final look. Sort by layer id (st0, st1, ...) for stable
    // ordering across re-renders.
    const merged: Record<string, string> = {
      ...sourceLayers,
      ...preset.layerOverrides,
    };
    const keys = Object.keys(merged).sort((a, b) => {
      const na = parseInt(a.replace(/^st/, ''), 10);
      const nb = parseInt(b.replace(/^st/, ''), 10);
      return (isNaN(na) ? 999 : na) - (isNaN(nb) ? 999 : nb);
    });
    return keys.map((k) => merged[k]).slice(0, 6);
  }, [sourceLayers, preset.layerOverrides]);

  return (
    <div
      className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full pl-1.5 pr-2 py-1 text-sm cursor-pointer transition-colors"
      onClick={onApply}
      title={`Apply "${preset.name}"`}
    >
      <div className="flex items-center">
        {swatches.map((color, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded-full border border-white -ml-1 first:ml-0"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span>{preset.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-40 hover:opacity-100 text-xs leading-none"
        title="Delete preset"
        aria-label={`Delete ${preset.name}`}
      >
        ×
      </button>
    </div>
  );
};

export default Presets;
