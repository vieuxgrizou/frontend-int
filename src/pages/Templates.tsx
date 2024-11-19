import React from 'react';
import { Plus } from 'lucide-react';
import type { CommentTemplate } from '../types';
import TemplateModal from '../components/TemplateModal';

export default function Templates() {
  const [showModal, setShowModal] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<CommentTemplate | null>(null);
  const [templates, setTemplates] = React.useState<CommentTemplate[]>([]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Modèles de commentaires</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowModal(true);
          }}
          className="button-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau modèle
        </button>
      </div>

      <div className="container-card">
        {/* ... reste du contenu ... */}
      </div>

      {showModal && (
        <TemplateModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
          onSave={(template) => {
            if (editingTemplate) {
              setTemplates(templates.map(t => t.id === template.id ? template : t));
            } else {
              setTemplates([...templates, template]);
            }
            setShowModal(false);
            setEditingTemplate(null);
          }}
          template={editingTemplate}
        />
      )}
    </div>
  );
}