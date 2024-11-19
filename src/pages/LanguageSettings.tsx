import React from 'react';
import { Globe2 } from 'lucide-react';
import { useLanguage } from '../utils/i18n/useLanguage';
import { AVAILABLE_LANGUAGES } from '../utils/i18n/translations';
import toast from 'react-hot-toast';

export default function LanguageSettings() {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = React.useState(language);

  const handleSave = () => {
    setLanguage(selectedLanguage);
    toast.success('Langue mise à jour');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Langue de l'interface</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choisissez la langue dans laquelle vous souhaitez utiliser l'application
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                  >
                    {AVAILABLE_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={selectedLanguage === language}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Globe2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Note : Les langues pour la génération de commentaires se configurent au niveau des personas et des sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}