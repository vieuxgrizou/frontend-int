import React from 'react';
import { Save } from 'lucide-react';
import type { Team, TeamRole } from '../../types/team';

interface TeamSettingsProps {
  team: Team;
  roles: TeamRole[];
  onUpdate: (updates: Partial<Team>) => void;
}

export default function TeamSettings({ team, roles, onUpdate }: TeamSettingsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement settings update
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Paramètres de l'équipe
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configurez les paramètres généraux de votre équipe
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-700">
                Nom de l'équipe
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  value={team.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Paramètres des membres
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configurez les options pour les membres de l'équipe
            </p>
          </div>

          <div className="mt-6">
            <fieldset>
              <div className="space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={team.settings.allowMemberInvites}
                      onChange={(e) => onUpdate({
                        settings: {
                          ...team.settings,
                          allowMemberInvites: e.target.checked
                        }
                      })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Autoriser les invitations par les membres
                    </label>
                    <p className="text-gray-500">
                      Permettre aux membres de l'équipe d'inviter de nouveaux membres
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={team.settings.requireApproval}
                      onChange={(e) => onUpdate({
                        settings: {
                          ...team.settings,
                          requireApproval: e.target.checked
                        }
                      })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Approbation requise
                    </label>
                    <p className="text-gray-500">
                      Les nouvelles invitations doivent être approuvées par un administrateur
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Limites
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Définissez les limites pour votre équipe
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Nombre maximum de membres
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  min="1"
                  value={team.settings.maxMembers}
                  onChange={(e) => onUpdate({
                    settings: {
                      ...team.settings,
                      maxMembers: parseInt(e.target.value)
                    }
                  })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Nombre maximum d'espaces de travail
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  min="1"
                  value={team.settings.maxWorkspaces}
                  onChange={(e) => onUpdate({
                    settings: {
                      ...team.settings,
                      maxWorkspaces: parseInt(e.target.value)
                    }
                  })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}