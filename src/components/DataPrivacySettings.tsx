import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { exportUserData, deleteUserData } from '../utils/security/gdpr';

interface DataPrivacySettingsProps {
  userId: string;
  onDataDeleted: () => void;
}

export default function DataPrivacySettings({ userId, onDataDeleted }: DataPrivacySettingsProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const blob = await exportUserData(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteUserData(userId);
    onDataDeleted();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
          Confidentialité des données
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
          Gérez vos données personnelles
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">
              Exporter mes données
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Téléchargez une copie de vos données personnelles
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="button-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Export en cours...' : 'Exporter'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">
              Supprimer mon compte
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Supprimez définitivement votre compte et toutes vos données
            </p>
          </div>
          {showDeleteConfirm ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm text-gray-600 dark:text-dark-secondary hover:text-gray-800 dark:hover:text-dark-primary"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="button-danger"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Confirmer la suppression
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="button-danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer mon compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}