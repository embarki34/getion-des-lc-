import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { Permission } from '../../../domain/entities/Permission';

export interface CreatePermissionDTO {
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  scope: 'all' | 'own' | 'company' | 'business-unit';
}

export class CreatePermissionCommand {
  constructor(public readonly dto: CreatePermissionDTO) {}
}

export class CreatePermissionCommandHandler {
  constructor(private readonly repository: IPermissionRepository) {}

  async execute(command: CreatePermissionCommand): Promise<string> {
    const existingPermission = await this.repository.findByCode(command.dto.code);
    if (existingPermission) {
      throw new Error(`Permission with code '${command.dto.code}' already exists`);
    }

    const permission = Permission.create({
      name: command.dto.name,
      code: command.dto.code,
      description: command.dto.description,
      resource: command.dto.resource,
      action: command.dto.action,
      scope: command.dto.scope,
    });

    await this.repository.save(permission);
    return permission.id;
  }
}

