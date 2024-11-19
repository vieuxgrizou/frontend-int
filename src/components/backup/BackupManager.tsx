import React from 'react';
import { Download, Upload, RefreshCw, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import type { BackupJob } from '../../utils/backup/types';

export default function BackupManager() {
  const [backupJobs, setBackupJobs] = React.useState<BackupJob[]>([
    {
      id: '1',
      type: 'auto',
      status: 'completed',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      size: 1024 * 1024 * 5, // 5MB
      items: {
        sites: 3,
        personas: 12,
        templates: 5,
        comments: 150
      }
    },
    {
      id: '2',
      type: 'manual',
      status: 'completed',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
      size: 1024 * 1024 * 4.2, // 4.2MB
      items: {
        sites: 3,
        personas: 10,
        templates: 5,
        comments: 120
      }
    }
  ]);

  const [settings, setSettings] = React.useState({
    autoBackup: true,
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    includeComments: true,
    compressBackups: true
  });

  const [isCreating, setIsCreating] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(false);

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      // Simuler la création d'une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup: BackupJob = {
        id: crypto.randomUUID(),
        type: 'manual',
        status: 'completed',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        size: 1024 * 1024 * 5.5,
        items: {
          sites: 3,
          personas: 12,
          templates: 5,
          comments: 150
        }
      };
      
      setBackupJobs(prev => [newBackup, ...prev]);
      toast.success('Sauvegarde créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreBackup = async (backup: BackupJob) => {
    setIsRestoring(true);
    try {
      // Simuler la restauration
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Sauvegarde restaurée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la restauration');
    } finally {
      setIsRestoring(false);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            Sauvegardes automatiques
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
            Configurez et gérez les sauvegardes automatiques de vos données
          </p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="button-primary"
        >
          {isCreating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Créer une sauvegarde
            </>
          )}
        </button>
      </div>

      <div className="container-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-dark-primary">
                Activer les sauvegardes automatiques
              </label>
            </div>
          </div>

          {settings.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                  Fréquence
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                  className="mt-1 input-standard w-full"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                  Heure d'exécution
                </label>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                  className="mt-1 input-standard w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                  Rétention (jours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                  className="mt-1 input-standard w-full"
                />
              </div>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.includeComments}
                onChange={(e) => setSettings({ ...settings, includeComments: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-dark-primary">
                Inclure l'historique des commentaires
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.compressBackups}
                onChange={(e) => setSettings({ ...settings, compressBackups: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-dark-primary">
                Compresser les sauvegardes
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="container-card">
        <h4 className="text-lg font-medium text-gray-900 dark:text-dark-primary mb-4">
          Historique des sauvegardes
        </h4>
        <div className="space-y-4">
          {backupJobs.map((backup) => (
            <div
              key={backup.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    backup.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : backup.status === 'failed'
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                  }`}>
                    {backup.status === 'completed' ? 'Terminée' : backup.status === 'failed' ? 'Échec' : 'En cours'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-dark-secondary">
                    {format(new Date(backup.startTime), 'PPp', { locale: fr })}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-dark-secondary">
                    ({formatSize(backup.size)})
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                  {backup.items.sites} sites, {backup.items.personas} personas,{' '}
                  {backup.items.templates} modèles, {backup.items.comments} commentaires
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleRestoreBackup(backup)}
                  disabled={isRestoring}
                  className="button-secondary"
                >
                  {isRestoring ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    const url = `data:application/json;base64,${btoa(JSON.stringify(backup))}`;
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup-${format(new Date(backup.startTime), 'yyyy-MM-dd-HH-mm')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="button-secondary"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}