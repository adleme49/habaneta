import React from 'react';
import { useTranslation } from 'react-i18next';
import { Undo2, Redo2 } from 'lucide-react';
import { useStore } from '../../../store/store';
import { Button } from '@/components/ui/button';

const EditorActions: React.FC = () => {
  const { t } = useTranslation();
  const {
    editingInstance,
    editingIndex,
    commitEditingToRecent,
    resetEditingTile,
    canResetEditing,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStore();

  if (!editingInstance) return null;

  const isEditingRecent = editingIndex !== undefined;
  const mod =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
      ? '⌘'
      : 'Ctrl';

  return (
    <div className="pt-6 flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={!canUndo}
          onClick={undo}
          title={`${t('editor.undo')} (${mod}+Z)`}
          aria-label={t('editor.undo')}
          className="h-8 w-8 p-0"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canRedo}
          onClick={redo}
          title={`${t('editor.redo')} (${mod}+Y)`}
          aria-label={t('editor.redo')}
          className="h-8 w-8 p-0"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canResetEditing}
          onClick={resetEditingTile}
          title={
            canResetEditing
              ? t('editor.resetColors')
              : t('editor.resetColorsNoChanges')
          }
        >
          {t('editor.resetColors')}
        </Button>
      </div>
      <Button disabled={isEditingRecent} onClick={commitEditingToRecent}>
        {isEditingRecent
          ? t('editor.alreadyInRecents')
          : t('editor.saveToRecents')}
      </Button>
    </div>
  );
};

export default EditorActions;
