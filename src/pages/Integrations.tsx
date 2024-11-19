import React from 'react';
import { HelpCircle, Copy } from 'lucide-react';
import WebhookManager from '../components/integrations/WebhookManager';
import NotificationChannels from '../components/integrations/NotificationChannels';
import { generateWebhookSecret } from '../utils/security/webhookSecurity';
import toast from 'react-hot-toast';

export default function Integrations() {
  const [webhookSecret, setWebhookSecret] = React.useState('');
  const [showSecret, setShowSecret] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(true);

  const generateNewSecret = () => {
    setWebhookSecret(generateWebhookSecret());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="page-title">API Webhooks</h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
            Configurez des webhooks pour intégrer avec n8n, Make, ou d'autres plateformes.
          </p>
        </div>
      </div>

      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Comment utiliser les webhooks ?
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                {/* ... reste du contenu ... */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="container-card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                URL du Webhook
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  value="https://api.intensify.app/webhook"
                  readOnly
                  className="input-readonly flex-1 min-w-0 block w-full px-3 rounded-l-lg"
                />
                <button
                  onClick={() => copyToClipboard("https://api.intensify.app/webhook")}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-dark rounded-r-lg bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary sm:text-sm hover:bg-gray-100 dark:hover:bg-dark"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Secret du Webhook
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <input
                  type={showSecret ? "text" : "password"}
                  value={webhookSecret}
                  readOnly
                  className="input-readonly flex-1 min-w-0 block w-full px-3 rounded-l-lg"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary sm:text-sm hover:bg-gray-100 dark:hover:bg-dark"
                >
                  {showSecret ? 'Masquer' : 'Afficher'}
                </button>
                <button
                  onClick={() => copyToClipboard(webhookSecret)}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary sm:text-sm hover:bg-gray-100 dark:hover:bg-dark"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={generateNewSecret}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-dark rounded-r-lg bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary sm:text-sm hover:bg-gray-100 dark:hover:bg-dark"
                >
                  Générer
                </button>
              </div>
            </div>
          </div>
        </div>

        <WebhookManager
          webhooks={[]}
          onAdd={() => {}}
          onUpdate={() => {}}
          onDelete={() => {}}
        />

        <NotificationChannels
          channels={[]}
          onAdd={() => {}}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
}