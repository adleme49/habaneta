import React from 'react';
import MainLayout from '../components/layout/main/MainLayaout.component';
import NavLayout from '../components/layout/nav/NavLayout.component';
import LoaderOverlay from '../components/common/Overlay.component';
import { useStore } from '../store/store';

const Home: React.FC = () => {
  const { overlay } = useStore();

  return (
    <div className="min-h-screen bg-white">
      <LoaderOverlay active={overlay}>
        <NavLayout />
        <MainLayout />
      </LoaderOverlay>
    </div>
  );
};

export default Home;
