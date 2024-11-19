import type { TeamRole, Permission } from '../types/team';

export function hasPermission(
  role: TeamRole,
  resource: Permission['resource'],
  action: Permission['actions'][number]
): boolean {
  const permission = role.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
}

export function canManageTeam(role: TeamRole): boolean {
  return hasPermission(role, 'team', 'manage');
}

export function canManageWorkspace(role: TeamRole): boolean {
  return hasPermission(role, 'workspace', 'manage');
}

export function canManageSites(role: TeamRole): boolean {
  return hasPermission(role, 'sites', 'manage');
}

export function canManagePersonas(role: TeamRole): boolean {
  return hasPermission(role, 'personas', 'manage');
}

export function canManageSchedules(role: TeamRole): boolean {
  return hasPermission(role, 'schedules', 'manage');
}

export function canManageTemplates(role: TeamRole): boolean {
  return hasPermission(role, 'templates', 'manage');
}

export function canManageSettings(role: TeamRole): boolean {
  return hasPermission(role, 'settings', 'manage');
}