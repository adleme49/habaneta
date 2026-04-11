import React from 'react';
import { useTranslation } from 'react-i18next';
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
  } = useStore();

  if (!editingInstance) return null;

  const isEditingRecent = editingIndex !== undefined;

  return (
    <div className="pt-6 flex items-center gap-2">
      <Button disabled={isEditingRecent} onClick={commitEditingToRecent}>
        {isEditingRecent
          ? t('editor.alreadyInRecents')
          : t('editor.saveToRecents')}
      </Button>
      <Button
        variant="outline"
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
  );
};

export default EditorActions;
