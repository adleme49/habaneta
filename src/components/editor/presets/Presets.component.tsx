import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store/store';
import { findSource, TilePreset } from '../../../lib/library';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Compact preset chip strip rendered above the tile. Each chip is a
 * small palette-dots preview + name + hover-revealed rename/delete.
 * The trailing "+" opens a small modal that's reused for both
 * create-new and rename flows.
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
    renamePreset,
  } = useStore();

  // modalMode drives the single Dialog — either creating a new
  // preset or renaming an existing one. Closed when undefined.
  type ModalMode =
    | { kind: 'create' }
    | { kind: 'rename'; preset: TilePreset }
    | undefined;
  const [modalMode, setModalMode] = useState<ModalMode>(undefined);

  if (!editingInstance) return null;

  const openCreate = () => setModalMode({ kind: 'create' });
  const openRename = (preset: TilePreset) =>
    setModalMode({ kind: 'rename', preset });
  const closeModal = () => setModalMode(undefined);

  const handleSubmit = (name: string) => {
    if (!modalMode) return;
    if (modalMode.kind === 'create') {
      savePreset(name);
    } else {
      renamePreset(modalMode.preset.id, name);
    }
    closeModal();
  };

  return (
    <>
      <div className="w-full flex items-center gap-1.5 flex-wrap">
        {presetsForEditing.length === 0 ? (
          <span className="text-xs italic text-gray-400 mr-auto">
            {t('editor.noPresetsYet')}
          </span>
        ) : (
          presetsForEditing.map((preset) => (
            <PresetChip
              key={preset.id}
              preset={preset}
              sourceLayers={findSource(library, preset.sourceId)?.layers ?? {}}
              onApply={() => applyPreset(preset)}
              onRename={() => openRename(preset)}
              onDelete={() => deletePreset(preset.id)}
            />
          ))
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={openCreate}
          className="h-7 ml-auto"
          title={t('editor.saveAsPreset')}
        >
          + {t('editor.newPreset')}
        </Button>
      </div>

      <PresetNameDialog
        mode={modalMode}
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
    </>
  );
};

/**
 * A single preset chip: 2–6 palette dots + name + hover-revealed
 * rename (pencil) and delete (×) affordances. Clicking the chip
 * applies the preset.
 */
const PresetChip: React.FC<{
  preset: TilePreset;
  sourceLayers: Record<string, string>;
  onApply: () => void;
  onRename: () => void;
  onDelete: () => void;
}> = ({ preset, sourceLayers, onApply, onRename, onDelete }) => {
  const { t } = useTranslation();
  const swatches = useMemo(() => {
    const merged: Record<string, string> = { ...sourceLayers, ...preset.layerOverrides };
    const keys = Object.keys(merged).sort((a, b) => {
      const na = parseInt(a.replace(/^st/, ''), 10);
      const nb = parseInt(b.replace(/^st/, ''), 10);
      return (isNaN(na) ? 999 : na) - (isNaN(nb) ? 999 : nb);
    });
    return keys.map((k) => merged[k]).slice(0, 5);
  }, [sourceLayers, preset.layerOverrides]);

  return (
    <div className="group relative flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-full pl-1.5 pr-1 h-7 text-sm transition-colors">
      <button
        type="button"
        onClick={onApply}
        className="flex items-center gap-2 h-full pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-full"
        title={t('editor.applyPreset', { name: preset.name })}
      >
        <span className="flex items-center">
          {swatches.map((color, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full border border-white -ml-1 first:ml-0 block"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
        <span className="pr-1">{preset.name}</span>
      </button>
      <button
        type="button"
        onClick={onRename}
        className="w-4 h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-500 hover:text-gray-800"
        title={t('editor.renamePreset', { name: preset.name })}
        aria-label={t('editor.renamePreset', { name: preset.name })}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-4 h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-500 hover:text-gray-800"
        title={t('editor.deletePreset', { name: preset.name })}
        aria-label={t('editor.deletePreset', { name: preset.name })}
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M2 2 L8 8 M8 2 L2 8" />
        </svg>
      </button>
    </div>
  );
};

/** Single small modal reused for create and rename. */
const PresetNameDialog: React.FC<{
  mode:
    | { kind: 'create' }
    | { kind: 'rename'; preset: TilePreset }
    | undefined;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}> = ({ mode, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mode) return;
    setName(mode.kind === 'rename' ? mode.preset.name : '');
    // Autofocus after the dialog paints.
    const id = setTimeout(() => inputRef.current?.select(), 50);
    return () => clearTimeout(id);
  }, [mode]);

  const canSubmit = name.trim().length > 0;

  return (
    <Dialog open={!!mode} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode?.kind === 'rename'
              ? t('editor.renamePresetTitle')
              : t('editor.newPresetTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <Label htmlFor="preset-name-input">{t('editor.presetName')}</Label>
          <Input
            id="preset-name-input"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) onSubmit(name.trim());
              if (e.key === 'Escape') onCancel();
            }}
            placeholder={t('editor.presetNamePlaceholder')}
            className="mt-1"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button disabled={!canSubmit} onClick={() => onSubmit(name.trim())}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Presets;
