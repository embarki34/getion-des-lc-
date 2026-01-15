import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';
import { Role } from '../../../domain/entities/Role';

export class GetRoleByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetRoleByIdQueryHandler {
  constructor(private readonly repository: IRoleRepository) {}

  async execute(query: GetRoleByIdQuery): Promise<Role | null> {
    return await this.repository.findById(query.id);
  }
}

