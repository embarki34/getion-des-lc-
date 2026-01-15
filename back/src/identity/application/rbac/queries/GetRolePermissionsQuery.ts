import { IRolePermissionRepository } from '../../../domain/repositories/IRolePermissionRepository';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';

export class GetRolePermissionsQuery {
  constructor(public readonly roleId: string) {}
}

export class GetRolePermissionsQueryHandler {
  constructor(
    private readonly rolePermissionRepository: IRolePermissionRepository,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async execute(query: GetRolePermissionsQuery): Promise<any[]> {
    const permissionIds = await this.rolePermissionRepository.findPermissionsByRoleId(query.roleId);

    const permissions = [];
    for (const permissionId of permissionIds) {
      const permission = await this.permissionRepository.findById(permissionId);
      if (permission) {
        permissions.push({
          id: permission.id,
          name: permission.name,
          code: permission.code,
          description: permission.description,
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope,
        });
      }
    }

    return permissions;
  }
}

