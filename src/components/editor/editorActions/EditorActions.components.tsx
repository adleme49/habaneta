import React from 'react';
import { useStore } from '../../../store/store';

const EditorActions: React.FC = () => {
  const { editingTile, addRecent, selectedTileIndex } = useStore();

  if (!editingTile) return null;

  // If we're already editing a tile from recent, no need to "save to recent" again
  // — edits are applied live via paintLayer.
  const isEditingRecent = selectedTileIndex !== undefined;

  return (
    <div className="pt-6">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        disabled={isEditingRecent}
        onClick={() => addRecent(editingTile)}
      >
        {isEditingRecent ? 'Already in recents' : 'Salvar a recientes'}
      </button>
    </div>
  );
};

export default EditorActions;
