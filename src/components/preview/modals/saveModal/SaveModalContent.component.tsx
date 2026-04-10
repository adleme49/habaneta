import React, { useContext, useState } from 'react';
import RecentContext from '../../../../context/recent/recent.context';
import TileInfo from './TileInfo.component';

const SaveModalContent: React.FC<{
  onClose: Function;
  gridImg: string | undefined;
}> = ({ onClose, gridImg }) => {
  const { selectedBorder, selectedFloor } = useContext(RecentContext);
  const [userInfo, setUserInfo] = useState({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Save</span>
        <button onClick={() => onClose()} className="text-white text-xl">×</button>
      </div>

      <div className="w-[90%] mx-auto p-4">
        <form onSubmit={onSubmitForm}>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" name="name" required onChange={handleInput} className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telf</label>
              <input type="text" name="phone" required onChange={handleInput} className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Habitacion</label>
              <input type="text" name="room" required onChange={handleInput} className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metros x 2</label>
              <input type="number" name="m2" required onChange={handleInput} className="border rounded px-2 py-1 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              {gridImg ? <img src={gridImg} alt="grid" className="w-full" /> : null}
            </div>
            <div>
              <div>
                {selectedFloor ? (
                  <TileInfo tile={selectedFloor} />
                ) : (
                  <h2>No selecciono ninguna Loza</h2>
                )}
              </div>
              <div>
                {selectedBorder ? (
                  <TileInfo tile={selectedBorder} />
                ) : (
                  <h2>No seleccionó ningun Borde</h2>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => onClose()}>Cancelar</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SaveModalContent;
