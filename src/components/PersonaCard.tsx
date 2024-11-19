import React from 'react';
import { Edit2, Globe2 } from 'lucide-react';
import type { Persona } from '../types';

interface PersonaCardProps {
  persona: Persona;
  onEdit: () => void;
}

export default function PersonaCard({ persona, onEdit }: PersonaCardProps) {
  // Vérification de sécurité pour les langues
  const languages = Array.isArray(persona.languages) ? persona.languages : [];

  return (
    <div className="container-card">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
              {persona.name}
            </h3>
          </div>
          <button
            onClick={onEdit}
            className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        </div>
        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-dark-secondary">Style</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-dark-primary">{persona.writingStyle}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-dark-secondary">Ton</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-dark-primary">{persona.tone}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-dark-secondary">Langues</dt>
            <dd className="mt-1 flex items-center">
              <Globe2 className="h-4 w-4 text-gray-400 dark:text-dark-secondary mr-1" />
              <span className="text-sm text-gray-900 dark:text-dark-primary">
                {languages.join(', ')}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}