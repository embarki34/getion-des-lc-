import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissions?: string[];
}

export class UpdateRoleCommand {
  constructor(public readonly id: string, public readonly dto: UpdateRoleDTO) { }
}

export class UpdateRoleCommandHandler {
  constructor(
    private readonly repository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository
  ) { }

  async execute(command: UpdateRoleCommand): Promise<void> {
    const role = await this.repository.findById(command.id);
    if (!role) {
      throw new Error(`Role with ID '${command.id}' not found`);
    }

    if (command.dto.name !== undefined) {
      role.updateName(command.dto.name);
    }

    if (command.dto.description !== undefined) {
      role.updateDescription(command.dto.description);
    }

    if (command.dto.isActive !== undefined) {
      if (command.dto.isActive) {
        role.activate();
      } else {
        role.deactivate();
      }
    }

    if (command.dto.permissions) {
      const permissions = [];
      for (const permissionId of command.dto.permissions) {
        const permission = await this.permissionRepository.findById(permissionId);
        if (!permission) {
          throw new Error(`Permission with ID '${permissionId}' not found`);
        }
        permissions.push({
          id: permission.id,
          code: permission.code,
          name: permission.name,
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope
        });
      }
      role.updatePermissions(permissions);
    }

    await this.repository.save(role);
  }
}

