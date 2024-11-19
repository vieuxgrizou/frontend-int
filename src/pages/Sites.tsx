import React from 'react';
import { Plus } from 'lucide-react';
import type { WordPressSite } from '../types';
import SiteSettingsModal from '../components/SiteSettingsModal';

export default function Sites() {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState<WordPressSite | null>(null);
  const [sites, setSites] = React.useState<WordPressSite[]>([]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Sites WordPress</h1>
        <button
          onClick={() => {
            setSelectedSite(null);
            setShowSettingsModal(true);
          }}
          className="button-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un site
        </button>
      </div>

      <div className="container-card">
        {/* ... reste du contenu ... */}
      </div>

      {showSettingsModal && (
        <SiteSettingsModal
          isOpen={showSettingsModal}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedSite(null);
          }}
          onSave={(site) => {
            if (selectedSite) {
              setSites(sites.map(s => s.id === site.id ? site : s));
            } else {
              setSites([...sites, site]);
            }
            setShowSettingsModal(false);
            setSelectedSite(null);
          }}
          site={selectedSite}
        />
      )}
    </div>
  );
}