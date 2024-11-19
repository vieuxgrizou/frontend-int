import React from 'react';
import { AlertTriangle, Search, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  userAgent?: string;
  path?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export default function ErrorLogs() {
  const [logs, setLogs] = React.useState<ErrorLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      level: 'error',
      message: 'Échec de la génération du commentaire : limite d\'API dépassée',
      userId: 'user_123',
      component: 'CommentGenerator',
      path: '/app/sites/123',
      metadata: {
        siteId: 'site_123',
        provider: 'openai'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      level: 'warning',
      message: 'Échec de la livraison du webhook : timeout',
      userId: 'user_456',
      component: 'WebhookManager',
      metadata: {
        webhookId: 'webhook_123',
        attempt: 2
      }
    }
  ]);

  const [filters, setFilters] = React.useState({
    level: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  const getLevelColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
    }
  };

  const exportLogs = () => {
    const data = logs.map(log => ({
      ...log,
      metadata: JSON.stringify(log.metadata)
    }));
    const csv = [
      ['ID', 'Timestamp', 'Level', 'Message', 'User ID', 'Component', 'Path', 'Metadata'].join(','),
      ...data.map(log => [
        log.id,
        log.timestamp,
        log.level,
        `"${log.message}"`,
        log.userId || '',
        log.component || '',
        log.path || '',
        `"${log.metadata || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journaux d'erreurs</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
            Consultez et analysez les erreurs rencontrées par vos utilisateurs
          </p>
        </div>
        <button
          onClick={exportLogs}
          className="button-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter les logs
        </button>
      </div>

      <div className="container-card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-dark-secondary" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Rechercher dans les logs..."
                className="input-standard pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="input-standard"
            >
              <option value="all">Tous les niveaux</option>
              <option value="error">Erreurs</option>
              <option value="warning">Avertissements</option>
              <option value="info">Informations</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-standard"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-standard"
            />
          </div>
        </div>
      </div>

      <div className="container-card">
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log, index) => (
              <li key={log.id}>
                <div className="relative pb-8">
                  {index !== logs.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-dark"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ${getLevelColor(log.level)}`}>
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-dark-primary">
                          {log.message}
                          {log.component && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-dark-secondary">
                              dans {log.component}
                            </span>
                          )}
                        </p>
                        {log.metadata && (
                          <pre className="mt-1 text-xs text-gray-500 dark:text-dark-secondary bg-gray-50 dark:bg-dark-hover p-2 rounded-lg">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                        {log.stack && (
                          <details className="mt-2">
                            <summary className="text-sm text-gray-500 dark:text-dark-secondary cursor-pointer">
                              Voir la stack trace
                            </summary>
                            <pre className="mt-1 text-xs text-gray-500 dark:text-dark-secondary bg-gray-50 dark:bg-dark-hover p-2 rounded-lg overflow-auto">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap">
                        <div className="text-gray-500 dark:text-dark-secondary">
                          <time dateTime={log.timestamp}>
                            {formatTimeAgo(log.timestamp)}
                          </time>
                        </div>
                        {log.userId && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-dark-secondary">
                            Utilisateur: {log.userId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}