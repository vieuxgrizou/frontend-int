import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import type { CommentTemplate } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: CommentTemplate) => void;
  template?: CommentTemplate | null;
}

export default function TemplateModal({ isOpen, onClose, onSave, template }: TemplateModalProps) {
  const [formData, setFormData] = React.useState<CommentTemplate>(template || {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    template: '',
    style: 'creative',
    flexibility: 0.7,
    contextRules: [],
    variables: [],
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="container-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            {template ? 'Modifier le modèle' : 'Nouveau modèle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Nom du modèle
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
              Modèle de commentaire
            </label>
            <textarea
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              rows={6}
              className="mt-1 input-standard w-full font-mono"
              placeholder="Exemple : J'apprécie vraiment {aspect_positif} de cet article. {commentaire_specifique}"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Utilisez les variables entre accolades pour les éléments dynamiques
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Flexibilité ({Math.round(formData.flexibility * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.flexibility}
              onChange={(e) => setFormData({ ...formData, flexibility: parseFloat(e.target.value) })}
              className="mt-1 w-full"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Détermine la liberté de l'IA par rapport au modèle
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-dark">
          <button
            onClick={onClose}
            className="button-secondary"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="button-primary"
          >
            {template ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}