import React from 'react';
import { Key, Save, Eye, EyeOff } from 'lucide-react';
import ApiKeyTester from '../components/ApiKeyTester';
import { AI_PROVIDERS } from '../utils/aiProviders';
import { useApiKeys } from '../utils/store/apiKeys';
import toast from 'react-hot-toast';

export default function ApiSettings() {
  const { getApiKey, setApiKey, updateKeyStatus } = useApiKeys();
  const [showKeys, setShowKeys] = React.useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const loadKeys = async () => {
      const keys: Record<string, string> = {};
      for (const provider of AI_PROVIDERS) {
        const key = await getApiKey(provider.id);
        if (key) {
          keys[provider.id] = key;
        }
      }
      setApiKeys(keys);
    };
    loadKeys();
  }, [getApiKey]);

  const handleSaveKey = async (providerId: string) => {
    try {
      setIsSaving(true);
      await setApiKey(providerId, apiKeys[providerId] || '');
      toast.success('Clé API sauvegardée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la clé API');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
          Configuration des API
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
          Configurez vos clés API pour les différents services d'IA
        </p>
      </div>

      <div className="space-y-6">
        {AI_PROVIDERS.map(provider => (
          <div key={provider.id} className="container-card">
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-dark-primary">
                  {provider.name}
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                  {provider.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                  Clé API {provider.name}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => setApiKeys(prev => ({
                      ...prev,
                      [provider.id]: e.target.value
                    }))}
                    className="input-standard pl-10 pr-20"
                    placeholder={`Clé API ${provider.name}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.id)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      {showKeys[provider.id] ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveKey(provider.id)}
                      disabled={isSaving}
                      className="button-primary ml-2 mr-2"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>

              <ApiKeyTester
                providerId={provider.id}
                onTest={(success) => {
                  updateKeyStatus(provider.id, success);
                }}
              />

              <div className="text-sm text-gray-500 dark:text-dark-secondary space-y-1">
                <p>Modèles disponibles :</p>
                <ul className="list-disc pl-5 space-y-1">
                  {provider.models.map(model => (
                    <li key={model.id}>
                      {model.name} - {model.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}