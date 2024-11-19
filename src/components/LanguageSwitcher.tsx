import React from 'react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import { useLanguage } from '../utils/i18n/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
      >
        <img
          src={`https://flagcdn.com/w40/${SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag || 'gb'}.png`}
          alt={language}
          className="w-6 h-4 object-cover rounded"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 bg-white rounded-md shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="flex flex-col">
            {SUPPORTED_LANGUAGES.map(({ code, name, flag }) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
              >
                <img
                  src={`https://flagcdn.com/w40/${flag}.png`}
                  alt={name}
                  className="w-6 h-4 object-cover rounded mr-2"
                />
                <span className="text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}