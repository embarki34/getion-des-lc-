import { Request, Response, NextFunction } from 'express';
import { GetAllPermissionsQuery, GetAllPermissionsQueryHandler } from '../../../application/rbac/queries/GetAllPermissionsQuery';

export class PermissionController {
    constructor(
        private readonly getAllHandler: GetAllPermissionsQueryHandler
    ) { }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = new GetAllPermissionsQuery();
            const permissions = await this.getAllHandler.execute(query);

            const response = permissions.map((p) => ({
                id: p.id,
                name: p.name,
                code: p.code,
                description: p.description,
                resource: p.resource,
                action: p.action,
                scope: p.scope,
            }));

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
