import { UserRole } from '../services/api';

export const PERMISSIONS: Record<UserRole, string[]> = {
  guest: ['view_events', 'view_groups'],
  user: [
    'view_events',
    'view_groups',
    'create_event',
    'create_group',
    'join_group',
    'edit_own_event',
    'delete_own_event',
    'edit_own_profile'
  ],
  moderator: [
    'view_events',
    'view_groups',
    'create_event',
    'create_group',
    'join_group',
    'edit_event',
    'delete_event',
    'view_users',
    'ban_user',
    'access_admin_panel'
  ],
  admin: [
    'view_events',
    'view_groups',
    'create_event',
    'create_group',
    'join_group',
    'edit_event',
    'delete_event',
    'view_users',
    'ban_user',
    'delete_user',
    'manage_categories',
    'manage_roles',
    'access_admin_panel'
  ]
};

export const hasPermission = (role: UserRole | undefined, permission: string): boolean => {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(permission) || false;
};

export const hasRole = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canCreateEvent = (role?: UserRole) => hasPermission(role, 'create_event');
export const canCreateGroup = (role?: UserRole) => hasPermission(role, 'create_group');

export const canEditEvent = (role?: UserRole, isOwner?: boolean) => {
  if (isOwner) return hasPermission(role, 'edit_own_event');
  return hasPermission(role, 'edit_event');
};

export const canDeleteEvent = (role?: UserRole, isOwner?: boolean) => {
  if (isOwner) return hasPermission(role, 'delete_own_event');
  return hasPermission(role, 'delete_event');
};

export const canAccessAdminPanel = (role?: UserRole) => hasPermission(role, 'access_admin_panel');
export const canManageUsers = (role?: UserRole) => hasPermission(role, 'manage_roles');
export const canBanUser = (role?: UserRole) => hasPermission(role, 'ban_user');