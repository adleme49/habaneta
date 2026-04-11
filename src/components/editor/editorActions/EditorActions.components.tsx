import React from 'react';
import { useStore } from '../../../store/store';
import { Button } from '@/components/ui/button';

const EditorActions: React.FC = () => {
  const {
    editingInstance,
    editingIndex,
    commitEditingToRecent,
    resetEditingTile,
    canResetEditing,
  } = useStore();

  if (!editingInstance) return null;

  // If the editor is backed by a recent slot, edits already flow through
  // paintLayer → UPDATE_EDITING, so there's nothing to "save".
  const isEditingRecent = editingIndex !== undefined;

  return (
    <div className="pt-6 flex items-center gap-2">
      <Button disabled={isEditingRecent} onClick={commitEditingToRecent}>
        {isEditingRecent ? 'Already in recents' : 'Salvar a recientes'}
      </Button>
      <Button
        variant="outline"
        disabled={!canResetEditing}
        onClick={resetEditingTile}
        title={canResetEditing ? 'Clear your color edits' : 'No changes to reset'}
      >
        Reset colors
      </Button>
    </div>
  );
};

export default EditorActions;
