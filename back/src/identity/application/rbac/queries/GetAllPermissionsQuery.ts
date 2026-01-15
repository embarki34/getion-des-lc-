import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepository';
import { Permission } from '../../../domain/entities/Permission';

export class GetAllPermissionsQuery { }

export class GetAllPermissionsQueryHandler {
    constructor(private readonly repository: IPermissionRepository) { }

    async execute(query: GetAllPermissionsQuery): Promise<Permission[]> {
        return await this.repository.findAll();
    }
}
