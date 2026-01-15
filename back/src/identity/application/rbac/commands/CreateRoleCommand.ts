import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { Role } from '../../../domain/entities/Role';

export interface CreateRoleDTO {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export class CreateRoleCommand {
  constructor(public readonly dto: CreateRoleDTO) {}
}

export class CreateRoleCommandHandler {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(command: CreateRoleCommand): Promise<string> {
    const existingRole = await this.repository.findByCode(command.dto.code);
    if (existingRole) {
      throw new Error(`Role with code '${command.dto.code}' already exists`);
    }

    const role = Role.create({
      name: command.dto.name,
      code: command.dto.code,
      description: command.dto.description,
      isActive: command.dto.isActive ?? true,
    });

    await this.repository.save(role);
    return role.id;
  }
}

