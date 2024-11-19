import React from 'react';
import { Shield, Clock } from 'lucide-react';
import type { TeamMember, TeamRole } from '../../types/team';

interface TeamMemberListProps {
  members: TeamMember[];
  roles: TeamRole[];
  onUpdateRole: (memberId: string, roleId: string) => void;
  onRemoveMember: (memberId: string) => void;
}

export default function TeamMemberList({
  members,
  roles,
  onUpdateRole,
  onRemoveMember
}: TeamMemberListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {members.map(member => (
          <li key={member.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0">
                  <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-gray-500" />
                  </span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {member.userId}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    Membre depuis {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={member.role.id}
                  onChange={(e) => onUpdateRole(member.id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Retirer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}