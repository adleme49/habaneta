import React from 'react';
import { useStore } from '../../../store/store';
import { Button } from '@/components/ui/button';

const EditorActions: React.FC = () => {
  const { editingTile, addRecent, selectedTileIndex } = useStore();

  if (!editingTile) return null;

  const isEditingRecent = selectedTileIndex !== undefined;

  return (
    <div className="pt-6">
      <Button
        disabled={isEditingRecent}
        onClick={() => addRecent(editingTile)}
      >
        {isEditingRecent ? 'Already in recents' : 'Salvar a recientes'}
      </Button>
    </div>
  );
};

export default EditorActions;
