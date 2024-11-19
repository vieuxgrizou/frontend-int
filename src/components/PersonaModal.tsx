import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { generateRandomPersona } from '../utils/personaGenerator';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import type { Persona } from '../types';
import toast from 'react-hot-toast';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
  initialPersona?: Persona;
}

export default function PersonaModal({ isOpen, onClose, onSave, initialPersona }: PersonaModalProps) {
  const [persona, setPersona] = React.useState<Persona>(initialPersona || generateRandomPersona(['fr']));
  const [showLanguageHelp, setShowLanguageHelp] = React.useState(false);

  const regenerate = () => {
    if (persona.languages.length === 0) {
      toast.error('Veuillez sélectionner au moins une langue');
      return;
    }
    setPersona(generateRandomPersona(persona.languages));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            {initialPersona ? 'Modifier le persona' : 'Créer un persona'}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="flex justify-end">
            <button
              onClick={regenerate}
              className="button-secondary"
            >
              Générer aléatoirement
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Langues
              </label>
              <button
                type="button"
                onClick={() => setShowLanguageHelp(!showLanguageHelp)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>

            {showLanguageHelp && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-md">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Sélectionnez les langues que ce persona peut utiliser pour commenter. La première langue sélectionnée sera utilisée pour générer un nom approprié.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {SUPPORTED_LANGUAGES.map(lang => (
                <label key={lang.code} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={persona.languages.includes(lang.code)}
                    onChange={(e) => {
                      const newLanguages = e.target.checked
                        ? [...persona.languages, lang.code]
                        : persona.languages.filter(l => l !== lang.code);
                      setPersona({ ...persona, languages: newLanguages });
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Nom
              </label>
              <input
                type="text"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                className="mt-1 input-standard w-full"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Âge
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={persona.age}
                onChange={(e) => setPersona({ ...persona, age: parseInt(e.target.value) })}
                className="mt-1 input-standard w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Genre
              </label>
              <select
                value={persona.gender}
                onChange={(e) => setPersona({ ...persona, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="mt-1 input-standard w-full"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Style d'écriture
              </label>
              <input
                type="text"
                value={persona.writingStyle}
                onChange={(e) => setPersona({ ...persona, writingStyle: e.target.value })}
                className="mt-1 input-standard w-full"
                placeholder="Professionnel, Décontracté, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                Taux d'erreurs (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(persona.errorRate * 100)}
                onChange={(e) => setPersona({ ...persona, errorRate: parseInt(e.target.value) / 100 })}
                className="mt-1 input-standard w-full"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={persona.emoji}
                onChange={(e) => setPersona({ ...persona, emoji: e.target.checked })}
                className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                Utiliser des emoji
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={persona.useHashtags}
                onChange={(e) => setPersona({ ...persona, useHashtags: e.target.checked })}
                className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                Utiliser des hashtags
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={persona.mentionOthers}
                onChange={(e) => setPersona({ ...persona, mentionOthers: e.target.checked })}
                className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                Mentionner d'autres utilisateurs
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="button-secondary"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (persona.languages.length === 0) {
                toast.error('Veuillez sélectionner au moins une langue');
                return;
              }
              onSave(persona);
            }}
            className="button-primary"
          >
            {initialPersona ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}