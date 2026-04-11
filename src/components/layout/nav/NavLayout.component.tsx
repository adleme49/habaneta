import React from 'react';
import { Link } from 'react-router-dom';

const NavLayout: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
      <h1 className="text-lg text-gray-700">Habaneta</h1>
      <nav className="text-sm">
        <Link
          to="/library"
          className="text-blue-600 hover:underline"
        >
          Library →
        </Link>
      </nav>
    </header>
  );
};

export default NavLayout;
