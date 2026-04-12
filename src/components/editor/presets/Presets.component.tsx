import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          {t('editor.presets')}
        </h3>
        {!isNaming && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNaming(true)}
          >
            {t('editor.saveAsPreset')}
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
            placeholder={t('editor.presetNamePlaceholder')}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            {t('common.save')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsNaming(false);
              setName('');
            }}
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}

      {presetsForEditing.length === 0 ? (
        <p className="text-xs text-gray-400">{t('editor.noPresetsYet')}</p>
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
  const { t } = useTranslation();
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
    <div className="group flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full pl-1.5 pr-1 py-0.5 text-sm transition-colors">
      <button
        type="button"
        onClick={onApply}
        className="flex items-center gap-2 py-0.5 pr-1 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        title={t('editor.applyPreset', { name: preset.name })}
      >
        <span className="flex items-center">
          {swatches.map((color, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-white -ml-1 first:ml-0 block"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
        <span>{preset.name}</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="opacity-40 hover:opacity-100 text-xs leading-none w-4 h-4 flex items-center justify-center rounded-full"
        title={t('editor.deletePreset', { name: preset.name })}
        aria-label={t('editor.deletePreset', { name: preset.name })}
      >
        ×
      </button>
    </div>
  );
};

export default Presets;
