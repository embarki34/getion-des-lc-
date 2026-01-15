import { IRbacService } from "../../domain/services/IRbacService";
import { IUserRoleRepository } from "../../domain/repositories/IUserRoleRepository";
import { IRolePermissionRepository } from "../../domain/repositories/IRolePermissionRepository";
import { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";

/**
 * RBAC Service Implementation
 * Handles permission checking based on user roles and permissions
 */
export class RbacService implements IRbacService {
  constructor(
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly rolePermissionRepository: IRolePermissionRepository,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async hasPermission(
    userId: string,
    permissionCode: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
      resourceId?: string;
      resourceOwnerId?: string;
    }
  ): Promise<boolean> {
    // Get user's roles in the given context
    const roleIds = await this.userRoleRepository.findRolesByUserId(
      userId,
      context?.companyId,
      context?.businessUnitId
    );

    if (roleIds.length === 0) {
      return false;
    }

    // Find the permission
    const permission = await this.permissionRepository.findByCode(permissionCode);
    if (!permission) {
      return false;
    }

    // Check if any of the user's roles has this permission
    for (const roleId of roleIds) {
      const hasPermission = await this.rolePermissionRepository.hasPermission(
        roleId,
        permission.id
      );

      if (hasPermission) {
        // Check scope-based access
        if (await this.checkScope(permission, context)) {
          return true;
        }
      }
    }

    return false;
  }

  async hasAnyPermission(
    userId: string,
    permissionCodes: string[],
    context?: {
      companyId?: string;
      businessUnitId?: string;
      resourceId?: string;
      resourceOwnerId?: string;
    }
  ): Promise<boolean> {
    for (const permissionCode of permissionCodes) {
      if (await this.hasPermission(userId, permissionCode, context)) {
        return true;
      }
    }
    return false;
  }

  async getUserPermissions(
    userId: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
    }
  ): Promise<string[]> {
    const roleIds = await this.userRoleRepository.findRolesByUserId(
      userId,
      context?.companyId,
      context?.businessUnitId
    );

    const permissionCodes = new Set<string>();

    for (const roleId of roleIds) {
      const permissionIds = await this.rolePermissionRepository.findPermissionsByRoleId(roleId);
      for (const permissionId of permissionIds) {
        const permission = await this.permissionRepository.findById(permissionId);
        if (permission) {
          permissionCodes.add(permission.code);
        }
      }
    }

    return Array.from(permissionCodes);
  }

  async getUserRoles(
    userId: string,
    context?: {
      companyId?: string;
      businessUnitId?: string;
    }
  ): Promise<string[]> {
    const roleIds = await this.userRoleRepository.findRolesByUserId(
      userId,
      context?.companyId,
      context?.businessUnitId
    );
    return roleIds;
  }

  private async checkScope(
    permission: any,
    context?: {
      companyId?: string;
      businessUnitId?: string;
      resourceId?: string;
      resourceOwnerId?: string;
    }
  ): Promise<boolean> {
    const scope = permission.scope || "all";

    switch (scope) {
      case "all":
        return true;

      case "own":
        // Check if the resource belongs to the user
        if (context?.resourceOwnerId && context?.resourceId) {
          return context.resourceOwnerId === context.resourceId;
        }
        return false;

      case "company":
        // User must be in the same company as the resource
        return !!context?.companyId;

      case "business-unit":
        // User must be in the same business unit as the resource
        return !!context?.businessUnitId;

      default:
        return false;
    }
  }
}

