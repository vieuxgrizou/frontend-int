import React from 'react';
import { Globe } from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../utils/i18n/translations';
import { useLanguage } from '../utils/i18n/useLanguage';
import { useTranslation } from '../utils/i18n/useTranslation';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSave = () => {
    setLanguage(selectedLanguage);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const currentLang = AVAILABLE_LANGUAGES.find(lang => lang.code === language);
  const isRTL = currentLang?.direction === 'rtl';

  return (
    <div className="space-y-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex gap-2">
        <select
          value={selectedLanguage}
          onChange={handleChange}
          className={`flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={selectedLanguage === language}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
            selectedLanguage === language
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          <Globe className="h-4 w-4 mr-1" />
          {t('common.apply')}
        </button>
      </div>
      
      {showConfirmation && (
        <div className="flex items-center text-sm text-green-600">
          <span className="h-4 w-4 mr-1">✓</span>
          {t('settings.languageUpdated')}
        </div>
      )}
    </div>
  );
}