import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.component';

const NavLayout: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
      <h1 className="text-lg text-gray-700">{t('nav.appTitle')}</h1>
      <nav className="flex items-center gap-3 text-sm">
        <LanguageSwitcher />
        <Link to="/library" className="text-blue-600 hover:underline">
          {t('nav.library')}
        </Link>
      </nav>
    </header>
  );
};

export default NavLayout;
