/**
 * User role enumeration
 */
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

/**
 * Permission definitions for each role
 */
export const RolePermissions: Record<UserRole, string[]> = {
    [UserRole.USER]: [
        'user:read:own',
        'user:update:own',
        'user:delete:own',
    ],
    [UserRole.MODERATOR]: [
        'user:read:own',
        'user:update:own',
        'user:delete:own',
        'user:read:all',
        'user:suspend',
    ],
    [UserRole.ADMIN]: [
        'user:read:own',
        'user:update:own',
        'user:delete:own',
        'user:read:all',
        'user:update:all',
        'user:delete:all',
        'user:suspend',
        'role:assign',
    ],
};

/**
 * Checks if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
    return RolePermissions[role].includes(permission);
}
