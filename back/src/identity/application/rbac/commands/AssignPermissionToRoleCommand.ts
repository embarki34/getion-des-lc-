import { IRolePermissionRepository } from '../../../domain/repositories/IRolePermissionRepository';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';

export interface AssignPermissionToRoleDTO {
  roleId: string;
  permissionId: string;
}

export class AssignPermissionToRoleCommand {
  constructor(public readonly dto: AssignPermissionToRoleDTO) {}
}

export class AssignPermissionToRoleCommandHandler {
  constructor(
    private readonly rolePermissionRepository: IRolePermissionRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async execute(command: AssignPermissionToRoleCommand): Promise<void> {
    // Verify role exists
    const role = await this.roleRepository.findById(command.dto.roleId);
    if (!role) {
      throw new Error(`Role with ID '${command.dto.roleId}' not found`);
    }

    // Verify permission exists
    const permission = await this.permissionRepository.findById(command.dto.permissionId);
    if (!permission) {
      throw new Error(`Permission with ID '${command.dto.permissionId}' not found`);
    }

    // Check if already assigned
    const hasPermission = await this.rolePermissionRepository.hasPermission(
      command.dto.roleId,
      command.dto.permissionId
    );
    if (hasPermission) {
      throw new Error(
        `Permission '${command.dto.permissionId}' is already assigned to role '${command.dto.roleId}'`
      );
    }

    await this.rolePermissionRepository.assignPermissionToRole(
      command.dto.roleId,
      command.dto.permissionId
    );
  }
}

