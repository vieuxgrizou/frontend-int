import React from 'react';
import { X, Mail, Shield } from 'lucide-react';
import type { TeamRole } from '../types/team';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            Inviter des membres
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Adresses email (une par ligne)
            </label>
            <div className="mt-1">
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                rows={4}
                className="input-standard w-full"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
              Rôle
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 input-standard w-full"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="button-primary"
            >
              Inviter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}