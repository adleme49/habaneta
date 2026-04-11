import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, setLanguage, LanguageCode } from '../../../i18n';

/**
 * Pill-style language toggle in the nav bar. Cycles through all
 * registered locales (currently EN / ES). Language choice persists
 * via localStorage in the i18n module.
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const active = i18n.language as LanguageCode;

  return (
    <div className="flex items-center gap-0.5 border border-gray-200 rounded-full overflow-hidden">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={`px-2 py-0.5 text-xs font-medium transition-colors ${
            active === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
