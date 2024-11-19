export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  settings: TeamSettings;
  members: TeamMember[];
  workspaces: Workspace[];
}

export interface TeamSettings {
  defaultRole: TeamRole;
  allowMemberInvites: boolean;
  requireApproval: boolean;
  maxMembers: number;
  maxWorkspaces: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  invitedBy?: string;
}

export interface TeamRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: 'sites' | 'personas' | 'schedules' | 'templates' | 'settings' | 'team' | 'workspace';
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface Workspace {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  sites: string[];
  personas: string[];
  templates: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface TeamAuditLog {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}