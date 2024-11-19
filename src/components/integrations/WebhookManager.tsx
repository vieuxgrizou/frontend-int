import React from 'react';
import { Plus, HelpCircle, Copy, MessageSquare, RefreshCw } from 'lucide-react';
import type { Webhook, WebhookEvent } from '../../types/integrations';
import { generateWebhookSecret } from '../../utils/security/webhookSecurity';
import toast from 'react-hot-toast';

interface WebhookManagerProps {
  webhooks: Webhook[];
  onAdd: (webhook: Omit<Webhook, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Webhook>) => void;
  onDelete: (id: string) => void;
}

export default function WebhookManager({ webhooks, onAdd, onUpdate, onDelete }: WebhookManagerProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(true);
  const [formData, setFormData] = React.useState<Partial<Webhook>>({
    name: '',
    url: '',
    events: [],
    headers: {},
    enabled: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">Webhooks</h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
            Configurez des webhooks pour automatiser la génération de commentaires
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="button-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un webhook
        </button>
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
                <p>Les webhooks permettent d'automatiser la génération de commentaires :</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Générer des commentaires automatiquement quand un nouvel article est publié</li>
                  <li>Répondre aux commentaires des visiteurs avec des personas spécifiques</li>
                  <li>Intégrer avec des outils d'automatisation comme :</li>
                </ul>

                <div className="mt-4 space-y-4">
                  <details className="text-sm">
                    <summary className="font-medium cursor-pointer">n8n</summary>
                    <div className="pl-4 mt-2 space-y-2">
                      <p>1. Créez un nouveau workflow dans n8n</p>
                      <p>2. Ajoutez un nœud "WordPress Trigger"</p>
                      <p>3. Ajoutez un nœud "HTTP Request" avec l'URL du webhook</p>
                      <p>4. Configurez l'authentification avec le secret</p>
                    </div>
                  </details>

                  <details className="text-sm">
                    <summary className="font-medium cursor-pointer">Make (Integromat)</summary>
                    <div className="pl-4 mt-2 space-y-2">
                      <p>1. Créez un nouveau scénario</p>
                      <p>2. Utilisez le module "WordPress"</p>
                      <p>3. Connectez au module "HTTP" avec l'URL du webhook</p>
                      <p>4. Ajoutez le secret dans les en-têtes</p>
                    </div>
                  </details>

                  <details className="text-sm">
                    <summary className="font-medium cursor-pointer">Zapier</summary>
                    <div className="pl-4 mt-2 space-y-2">
                      <p>1. Créez un nouveau Zap</p>
                      <p>2. Choisissez WordPress comme déclencheur</p>
                      <p>3. Utilisez "Webhooks by Zapier" comme action</p>
                      <p>4. Configurez avec l'URL et le secret fournis</p>
                    </div>
                  </details>

                  <details className="text-sm">
                    <summary className="font-medium cursor-pointer">Formats des événements</summary>
                    <div className="pl-4 mt-2 space-y-2">
                      <p className="font-medium">post.created</p>
                      <pre className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-xs">
{`{
  "event": "post.created",
  "siteId": "site_123",
  "data": {
    "postId": "123",
    "postTitle": "Titre",
    "postContent": "Contenu",
    "language": "fr",
    "personaCount": 3
  }
}`}
                      </pre>

                      <p className="font-medium mt-4">comment.reply</p>
                      <pre className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-xs">
{`{
  "event": "comment.reply",
  "siteId": "site_123",
  "data": {
    "postId": "123",
    "commentId": "456",
    "personaId": "789",
    "replyDelay": 300
  }
}`}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-card">
        <ul className="divide-y divide-gray-200 dark:divide-dark">
          {webhooks.map(webhook => (
            <li key={webhook.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">
                        {webhook.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                        {webhook.url}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        webhook.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : webhook.status === 'failing'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {webhook.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onDelete(webhook.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map(event => (
                        <span
                          key={event}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}