import React from 'react';
import { Plus, HelpCircle, Download, Info } from 'lucide-react';
import { generateRandomPersona } from '../utils/personaGenerator';
import { parseCSV, validatePersonaCSV } from '../utils/csvHandler';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import type { Persona, WordPressSite } from '../types';
import toast from 'react-hot-toast';

interface BulkPersonaImportProps {
  onImport: (personas: Persona[], siteIds: string[]) => void;
  onCancel: () => void;
  sites: WordPressSite[];
}

export default function BulkPersonaImport({ onImport, onCancel, sites }: BulkPersonaImportProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [bulkCount, setBulkCount] = React.useState(10);
  const [selectedSites, setSelectedSites] = React.useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(['fr']); // Français par défaut
  const [showLanguageHelp, setShowLanguageHelp] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const content = await file.text();
      const parsedData = await parseCSV(content);
      const validatedPersonas = validatePersonaCSV(parsedData);
      onImport(validatedPersonas, selectedSites);
    } catch (error) {
      console.error('Error importing personas:', error);
      toast.error("Erreur lors de l'import du fichier");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBulkGenerate = () => {
    if (selectedLanguages.length === 0) {
      toast.error('Veuillez sélectionner au moins une langue');
      return;
    }

    setIsProcessing(true);
    try {
      // Générer les personas en utilisant les langues sélectionnées
      const personas = Array.from({ length: bulkCount }, () => 
        generateRandomPersona(selectedLanguages)
      );
      onImport(personas, selectedSites);
      toast.success(`${bulkCount} personas générés avec succès`);
    } catch (error) {
      console.error('Error generating personas:', error);
      toast.error('Erreur lors de la génération des personas');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `firstName,lastName,gender,age,writingStyle,tone,languages,errorRate
John,Doe,male,35,Informel,Amical,"fr,en",0.05
Jane,Smith,female,28,Professionnel,Neutre,"en,es",0.02
`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'persona-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container-card space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">Import en masse</h3>
        <div className="flex space-x-2">
          <button
            onClick={downloadTemplate}
            className="button-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger le modèle CSV
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Langues des personas
            </label>
            <button
              type="button"
              onClick={() => setShowLanguageHelp(!showLanguageHelp)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
          
          {showLanguageHelp && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-md">
              <div className="flex">
                <HelpCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Sélectionnez une ou plusieurs langues pour vos personas. Chaque persona généré :
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm text-blue-600 dark:text-blue-300">
                    <li>Utilisera les langues sélectionnées pour la génération de commentaires</li>
                    <li>Aura un nom adapté à la première langue sélectionnée</li>
                    <li>Pourra commenter sur des articles dans toutes les langues choisies</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <label key={lang.code} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang.code)}
                  onChange={(e) => {
                    setSelectedLanguages(prev =>
                      e.target.checked
                        ? [...prev, lang.code]
                        : prev.filter(code => code !== lang.code)
                    );
                  }}
                  className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                  {lang.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
            Assigner aux sites
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sites.map(site => (
              <label key={site.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSites.includes(site.id)}
                  onChange={(e) => {
                    setSelectedSites(prev =>
                      e.target.checked
                        ? [...prev, site.id]
                        : prev.filter(id => id !== site.id)
                    );
                  }}
                  className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary truncate">
                  {site.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">Import depuis CSV</h4>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-dark border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-dark hover:bg-gray-100 dark:hover:bg-dark-hover">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Download className="w-8 h-8 mb-4 text-gray-500 dark:text-dark-secondary" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-dark-secondary">
                    <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-secondary">CSV uniquement</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">Génération aléatoire</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Nombre de personas à générer
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value))}
                className="mt-1 input-standard w-full"
              />
            </div>
            <button
              onClick={handleBulkGenerate}
              disabled={isProcessing || selectedLanguages.length === 0}
              className="button-primary w-full"
            >
              {isProcessing ? (
                <>
                  <HelpCircle className="animate-spin h-4 w-4 mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Générer les personas
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-dark">
        <button
          onClick={onCancel}
          className="button-secondary"
          disabled={isProcessing}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}