import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { IUserRoleRepository } from '../../../domain/repositories/IUserRoleRepository';

export class DeleteRoleCommand {
  constructor(public readonly id: string) {}
}

export class DeleteRoleCommandHandler {
  constructor(
    private readonly repository: IRoleRepository,
    private readonly userRoleRepository: IUserRoleRepository
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const role = await this.repository.findById(command.id);
    if (!role) {
      throw new Error(`Role with ID '${command.id}' not found`);
    }

    // Check if role is assigned to any users
    const usersWithRole = await this.userRoleRepository.findUsersByRoleId(command.id);
    if (usersWithRole.length > 0) {
      throw new Error(
        `Cannot delete role with ID '${command.id}' because it is assigned to ${usersWithRole.length} user(s). Please remove the role from all users first.`
      );
    }

    await this.repository.delete(command.id);
  }
}

