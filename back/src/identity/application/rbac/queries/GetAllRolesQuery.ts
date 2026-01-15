import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { Role } from '../../../domain/entities/Role';

export class GetAllRolesQuery {
  constructor(public readonly includeInactive: boolean = false) {}
}

export class GetAllRolesQueryHandler {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(query: GetAllRolesQuery): Promise<Role[]> {
    const allRoles = await this.repository.findAll();
    if (query.includeInactive) {
      return allRoles;
    }
    return allRoles.filter((r) => r.isActive);
  }
}

