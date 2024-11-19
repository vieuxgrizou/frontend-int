import React from 'react';
import { X } from 'lucide-react';
import type { PersonaGroup } from '../types';
import type { WordPressSite } from '../types';

interface PersonaGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: PersonaGroup) => void;
  sites: WordPressSite[];
  initialGroup?: PersonaGroup;
}

export default function PersonaGroupModal({
  isOpen,
  onClose,
  onSave,
  sites,
  initialGroup
}: PersonaGroupModalProps) {
  const [formData, setFormData] = React.useState<Partial<PersonaGroup>>(
    initialGroup || {
      name: '',
      description: '',
      personas: [],
      sites: []
    }
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            {initialGroup ? 'Modifier le groupe' : 'Nouveau groupe'}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Nom du groupe
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 input-standard w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 input-standard w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Sites associés
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {sites.map(site => (
                <label key={site.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sites?.includes(site.id)}
                    onChange={(e) => {
                      const newSites = e.target.checked
                        ? [...(formData.sites || []), site.id]
                        : (formData.sites || []).filter(id => id !== site.id);
                      setFormData({ ...formData, sites: newSites });
                    }}
                    className="rounded border-gray-300 dark:border-dark text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-paper"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                    {site.name}
                  </span>
                </label>
              ))}
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
              onSave({
                ...formData,
                id: initialGroup?.id || crypto.randomUUID(),
                personas: formData.personas || [],
                createdAt: initialGroup?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              } as PersonaGroup);
            }}
            className="button-primary"
          >
            {initialGroup ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}