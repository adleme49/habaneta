import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { Button } from '@/components/ui/button';

/**
 * Preset chips + save-as control, shown below the tile in the editor.
 * Hidden when no tile is being edited.
 */
const Presets: React.FC = () => {
  const { editingInstance, presetsForEditing, savePreset, applyPreset, deletePreset } =
    useStore();

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
            <div
              key={preset.id}
              className="group flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer"
              onClick={() => applyPreset(preset)}
              title={`Apply "${preset.name}"`}
            >
              <span>{preset.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePreset(preset.id);
                }}
                className="opacity-40 hover:opacity-100 text-xs leading-none ml-1"
                title="Delete preset"
                aria-label={`Delete ${preset.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Presets;
