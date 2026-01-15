/**
 * RBAC Service Interface
 * Provides methods for checking user permissions based on roles and permissions
 */
export interface IRbacService {
  /**
   * Check if a user has a specific permission
   * @param userId User ID
   * @param permissionCode Permission code (e.g., 'user:read:all')
   * @param context Optional context for scoped permissions (companyId, businessUnitId, resourceId)
   */
  hasPermission(
    userId: string,
    permissionCode: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
      resourceId?: string;
      resourceOwnerId?: string;
    }
  ): Promise<boolean>;

  /**
   * Check if a user has any of the specified permissions
   */
  hasAnyPermission(
    userId: string,
    permissionCodes: string[],
    context?: {
      companyId?: string;
      businessUnitId?: string;
      resourceId?: string;
      resourceOwnerId?: string;
    }
  ): Promise<boolean>;

  /**
   * Get all permissions for a user
   */
  getUserPermissions(
    userId: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
    }
  ): Promise<string[]>;

  /**
   * Get all roles for a user
   */
  getUserRoles(
    userId: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
    }
  ): Promise<string[]>;
}

