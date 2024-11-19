import React from 'react';
import { Bell, Slack, MessageCircle, Mail } from 'lucide-react';
import type { NotificationChannel } from '../../types/integrations';

interface NotificationChannelsProps {
  channels: NotificationChannel[];
  onAdd: (channel: Omit<NotificationChannel, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<NotificationChannel>) => void;
  onDelete: (id: string) => void;
}

export default function NotificationChannels({
  channels,
  onAdd,
  onUpdate,
  onDelete
}: NotificationChannelsProps) {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="container-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            Canaux de notification
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
            Configurez les canaux pour recevoir des notifications
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="button-primary"
        >
          <Bell className="h-4 w-4 mr-2" />
          Ajouter un canal
        </button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-dark">
        {channels.map(channel => (
          <div key={channel.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-gray-400 dark:text-dark-secondary">
                  {channel.type === 'slack' && <Slack className="h-5 w-5" />}
                  {channel.type === 'discord' && <MessageCircle className="h-5 w-5" />}
                  {channel.type === 'email' && <Mail className="h-5 w-5" />}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">
                    {channel.name}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                    {channel.type === 'email'
                      ? `${(channel.config as any).recipients?.length || 0} destinataires`
                      : `Webhook ${channel.type}`}
                  </p>
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={channel.enabled}
                    onChange={(e) => onUpdate(channel.id, { enabled: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                    Actif
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}