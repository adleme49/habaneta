import React, { useContext } from 'react';
import RecentContext from '../../../context/recent/recent.context';
import EditorContext from '../../../context/editor/editor.context';

const EditorActions: React.FC = () => {
  const { tile } = useContext(EditorContext);
  const { addRecent } = useContext(RecentContext);

  const handleAddtoRecent = () => {
    if (tile) {
      addRecent(tile);
    }
  };

  return (
    <div className="pt-8">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleAddtoRecent}
      >
        Salvar a recientes
      </button>
    </div>
  );
};

export default EditorActions;
