import { IUserRoleRepository } from '../../../domain/repositories/IUserRoleRepository';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepository';

export class GetUserRolesQuery {
  constructor(
    public readonly userId: string,
    public readonly companyId?: string,
    public readonly businessUnitId?: string
  ) {}
}

export class GetUserRolesQueryHandler {
  constructor(
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(query: GetUserRolesQuery): Promise<any[]> {
    const roleIds = await this.userRoleRepository.findRolesByUserId(
      query.userId,
      query.companyId,
      query.businessUnitId
    );

    const roles = [];
    for (const roleId of roleIds) {
      const role = await this.roleRepository.findById(roleId);
      if (role) {
        roles.push({
          id: role.id,
          name: role.name,
          code: role.code,
          description: role.description,
          isActive: role.isActive,
        });
      }
    }

    return roles;
  }
}

