import React from 'react';
import { UserPlus } from 'lucide-react';
import TeamMemberList from '../components/TeamMemberList';
import TeamInviteModal from '../components/TeamInviteModal';
import type { TeamMember, TeamRole } from '../types/team';

export default function Team() {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [roles] = React.useState<TeamRole[]>([]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Membres de l'équipe</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="button-primary"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter des membres
        </button>
      </div>

      <TeamMemberList
        members={members}
        roles={roles}
        onUpdateRole={(memberId, roleId) => {
          setMembers(prev =>
            prev.map(member =>
              member.id === memberId
                ? { ...member, role: roles.find(r => r.id === roleId)! }
                : member
            )
          );
        }}
        onRemoveMember={(memberId) => {
          setMembers(prev => prev.filter(member => member.id !== memberId));
        }}
      />

      {showInviteModal && (
        <TeamInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={(emails, roleId) => {
            // Logique d'invitation
            console.log('Inviting:', { emails, roleId });
          }}
          roles={roles}
        />
      )}
    </div>
  );
}