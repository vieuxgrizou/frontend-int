import React from 'react';
import { createBackup, restoreBackup, getBackupHistory } from '../utils/security/backup';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Upload, RefreshCw } from 'lucide-react';

export default function BackupManager() {
  const [backupHistory, setBackupHistory] = React.useState<any[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(false);

  React.useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = () => {
    const history = getBackupHistory();
    setBackupHistory(history);
  };

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      await createBackup();
      loadBackupHistory();
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    try {
      await restoreBackup(backupId);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Sauvegardes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les sauvegardes de vos données
          </p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {isCreating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Créer une sauvegarde
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {backupHistory.map((backup) => (
            <li key={backup.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    Sauvegarde du {format(new Date(backup.startTime), 'PPpp', { locale: fr })}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Taille: {backup.size ? `${(backup.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    backup.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : backup.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {backup.status}
                  </span>
                  {backup.status === 'completed' && (
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={isRestoring}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurer
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}