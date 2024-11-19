import React, { Suspense } from 'react';
import { Plus, Users, FolderPlus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePersonas } from '../utils/hooks/usePersonas';
import { useSites } from '../utils/hooks/useSites';
import type { Persona, PersonaGroup } from '../types';
import PersonaModal from '../components/PersonaModal';
import BulkPersonaImport from '../components/BulkPersonaImport';
import PersonaGroupModal from '../components/PersonaGroupModal';
import PersonaCard from '../components/PersonaCard';
import ErrorBoundary from '../components/ErrorBoundary';
import toast from 'react-hot-toast';

function PersonasContent() {
  const queryClient = useQueryClient();
  const { personas = [], createPersona, updatePersona, isLoading: isLoadingPersonas } = usePersonas();
  const { sites = [], isLoading: isLoadingSites } = useSites();
  
  const [showModal, setShowModal] = React.useState(false);
  const [showBulkImport, setShowBulkImport] = React.useState(false);
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [editingPersona, setEditingPersona] = React.useState<Persona | undefined>();
  const [groups, setGroups] = React.useState<PersonaGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  // Personas non groupés
  const ungroupedPersonas = personas?.filter(persona => 
    !groups.some(group => group.personas.includes(persona.id))
  ) || [];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleCreateGroup = (group: PersonaGroup) => {
    setGroups([...groups, group]);
    setShowGroupModal(false);
  };

  const handleSave = async (persona: Persona) => {
    try {
      if (editingPersona) {
        await updatePersona({ id: editingPersona.id, ...persona });
        toast.success('Persona mis à jour avec succès');
      } else {
        await createPersona(persona);
        toast.success('Persona créé avec succès');
      }
      setShowModal(false);
      setEditingPersona(undefined);
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    } catch (error) {
      console.error('Error saving persona:', error);
      toast.error('Erreur lors de la sauvegarde du persona');
    }
  };

  const handleBulkImport = async (newPersonas: Persona[], siteIds: string[]) => {
    try {
      // Créer les personas
      for (const persona of newPersonas) {
        await createPersona(persona);
      }
      
      // Si des sites sont sélectionnés, créer un nouveau groupe
      if (siteIds.length > 0) {
        const groupId = crypto.randomUUID();
        const newGroup: PersonaGroup = {
          id: groupId,
          name: `Import ${new Date().toLocaleDateString()}`,
          personas: newPersonas.map(p => p.id),
          sites: siteIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setGroups(prev => [...prev, newGroup]);
      }
      
      setShowBulkImport(false);
      toast.success(`${newPersonas.length} personas importés avec succès`);
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    } catch (error) {
      console.error('Error importing personas:', error);
      toast.error('Erreur lors de l\'import des personas');
    }
  };

  if (isLoadingPersonas || isLoadingSites) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Personas</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowBulkImport(true)}
            className="button-secondary"
          >
            <Users className="h-4 w-4 mr-2" />
            Import en masse
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="button-secondary"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Nouveau groupe
          </button>
          <button
            onClick={() => {
              setEditingPersona(undefined);
              setShowModal(true);
            }}
            className="button-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un persona
          </button>
        </div>
      </div>

      {/* Groupes de personas */}
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="container-card">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-hover"
            >
              <div className="flex items-center">
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-dark-primary">
                  {group.name}
                </h3>
                <span className="ml-2 text-sm text-gray-500 dark:text-dark-secondary">
                  ({personas?.filter(p => group.personas.includes(p.id)).length || 0} personas)
                </span>
              </div>
              {group.sites && group.sites.length > 0 && (
                <div className="flex items-center space-x-2">
                  {group.sites.map(siteId => {
                    const site = sites?.find(s => s.id === siteId);
                    return site && (
                      <span key={siteId} className="text-sm text-gray-500 dark:text-dark-secondary">
                        {site.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </button>
            
            {expandedGroups.has(group.id) && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-dark">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {personas
                    ?.filter(persona => group.personas.includes(persona.id))
                    .map(persona => (
                      <PersonaCard
                        key={persona.id}
                        persona={persona}
                        onEdit={() => {
                          setEditingPersona(persona);
                          setShowModal(true);
                        }}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Personas non groupés */}
        {ungroupedPersonas.length > 0 && (
          <div className="container-card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary mb-4">
              Personas non groupés
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ungroupedPersonas.map(persona => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  onEdit={() => {
                    setEditingPersona(persona);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <PersonaModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingPersona(undefined);
          }}
          onSave={handleSave}
          initialPersona={editingPersona}
          groups={groups}
        />
      )}

      {showBulkImport && (
        <BulkPersonaImport
          onImport={handleBulkImport}
          onCancel={() => setShowBulkImport(false)}
          sites={sites || []}
          groups={groups}
        />
      )}

      {showGroupModal && (
        <PersonaGroupModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          onSave={handleCreateGroup}
          sites={sites || []}
        />
      )}
    </div>
  );
}

export default function Personas() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      }>
        <PersonasContent />
      </Suspense>
    </ErrorBoundary>
  );
}