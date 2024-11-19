import React from 'react';
import { Save, Plus, Trash2, Sliders } from 'lucide-react';
import type { CommentTemplate } from '../types';
import { COMMENT_STYLES } from '../utils/constants';

interface CommentTemplateEditorProps {
  template?: CommentTemplate;
  onSave: (template: CommentTemplate) => void;
  onCancel: () => void;
}

export default function CommentTemplateEditor({ template, onSave, onCancel }: CommentTemplateEditorProps) {
  const [formData, setFormData] = React.useState<CommentTemplate>(template || {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    template: '',
    style: COMMENT_STYLES.CREATIVE.name,
    flexibility: COMMENT_STYLES.CREATIVE.flexibility,
    contextRules: [],
    variables: [],
    topics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* ... autres champs existants ... */}

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Style de génération
          </label>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Sliders className="h-4 w-4 inline mr-1" />
            {showAdvanced ? 'Masquer les options avancées' : 'Options avancées'}
          </button>
        </div>
        <select
          value={formData.style}
          onChange={(e) => {
            const style = Object.values(COMMENT_STYLES).find(s => s.name === e.target.value);
            setFormData({
              ...formData,
              style: e.target.value,
              flexibility: style?.flexibility || COMMENT_STYLES.CREATIVE.flexibility
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Object.values(COMMENT_STYLES).map(style => (
            <option key={style.name} value={style.name}>
              {style.name} - {style.description}
            </option>
          ))}
        </select>
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Flexibilité ({Math.round(formData.flexibility * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.flexibility}
              onChange={(e) => setFormData({
                ...formData,
                flexibility: parseFloat(e.target.value)
              })}
              className="mt-1 w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              Ajustez la liberté créative de l'IA par rapport au template
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Règles contextuelles
            </label>
            <div className="mt-1 space-y-2">
              {formData.contextRules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...formData.contextRules];
                      newRules[index] = e.target.value;
                      setFormData({ ...formData, contextRules: newRules });
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Ex: Si l'article mentionne X, alors..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newRules = formData.contextRules.filter((_, i) => i !== index);
                      setFormData({ ...formData, contextRules: newRules });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  contextRules: [...formData.contextRules, '']
                })}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une règle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ... boutons de sauvegarde ... */}
    </div>
  );
}