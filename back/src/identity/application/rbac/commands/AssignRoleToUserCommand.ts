import { IUserRoleRepository } from '../../../domain/repositories/IUserRoleRepository';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { IUserRepository } from '../../ports/IUserRepository';

export interface AssignRoleToUserDTO {
  userId: string;
  roleId: string;
  companyId?: string;
  businessUnitId?: string;
  assignedBy?: string;
}

export class AssignRoleToUserCommand {
  constructor(public readonly dto: AssignRoleToUserDTO) {}
}

export class AssignRoleToUserCommandHandler {
  constructor(
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<void> {
    // Verify user exists
    const user = await this.userRepository.findById(command.dto.userId as any);
    if (!user) {
      throw new Error(`User with ID '${command.dto.userId}' not found`);
    }

    // Verify role exists
    const role = await this.roleRepository.findById(command.dto.roleId);
    if (!role) {
      throw new Error(`Role with ID '${command.dto.roleId}' not found`);
    }

    // Check if already assigned
    const hasRole = await this.userRoleRepository.hasRole(
      command.dto.userId,
      command.dto.roleId,
      command.dto.companyId,
      command.dto.businessUnitId
    );
    if (hasRole) {
      throw new Error(`Role '${command.dto.roleId}' is already assigned to user '${command.dto.userId}'`);
    }

    await this.userRoleRepository.assignRoleToUser(
      command.dto.userId,
      command.dto.roleId,
      command.dto.companyId,
      command.dto.businessUnitId,
      command.dto.assignedBy
    );
  }
}

