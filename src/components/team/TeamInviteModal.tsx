import React from 'react';
import { X, Mail, Shield } from 'lucide-react';
import type { TeamRole } from '../../types/team';

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[], roleId: string) => void;
  roles: TeamRole[];
}

export default function TeamInviteModal({
  isOpen,
  onClose,
  onInvite,
  roles
}: TeamInviteModalProps) {
  const [emails, setEmails] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState(roles[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails.split('\n').map(e => e.trim()).filter(Boolean);
    onInvite(emailList, selectedRole);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Inviter des membres</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresses email (une par ligne)
            </label>
            <div className="mt-1">
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Inviter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}