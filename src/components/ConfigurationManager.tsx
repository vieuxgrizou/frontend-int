import React from 'react';
import { Upload, Download, Save } from 'lucide-react';
import { exportConfiguration, importConfiguration, downloadConfiguration } from '../utils/import-export';

export default function ConfigurationManager() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportConfiguration();
      downloadConfiguration(blob);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importConfiguration(file);
      // TODO: Show success message
    } catch (error) {
      // TODO: Show error message
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Gestion de la configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Exportez ou importez vos configurations pour les sauvegarder ou les partager.
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Export en cours...' : 'Exporter la configuration'}
        </button>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Import en cours...' : 'Importer une configuration'}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              L'import d'une configuration remplacera vos paramètres actuels. Assurez-vous d'avoir exporté vos données avant de procéder à l'import.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}