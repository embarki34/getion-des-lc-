import { Request, Response, NextFunction } from 'express';
import { CreateRoleCommand, CreateRoleCommandHandler } from '../../../application/rbac/commands/CreateRoleCommand';
import { UpdateRoleCommand, UpdateRoleCommandHandler } from '../../../application/rbac/commands/UpdateRoleCommand';
import { DeleteRoleCommand, DeleteRoleCommandHandler } from '../../../application/rbac/commands/DeleteRoleCommand';
import { GetRoleByIdQuery, GetRoleByIdQueryHandler } from '../../../application/rbac/queries/GetRoleByIdQuery';
import { GetAllRolesQuery, GetAllRolesQueryHandler } from '../../../application/rbac/queries/GetAllRolesQuery';

export class RoleController {
  constructor(
    private readonly createHandler: CreateRoleCommandHandler,
    private readonly updateHandler: UpdateRoleCommandHandler,
    private readonly deleteHandler: DeleteRoleCommandHandler,
    private readonly getByIdHandler: GetRoleByIdQueryHandler,
    private readonly getAllHandler: GetAllRolesQueryHandler
  ) { }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command = new CreateRoleCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Role created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new UpdateRoleCommand(id, req.body);
      await this.updateHandler.execute(command);
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteRoleCommand(id);
      await this.deleteHandler.execute(command);
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetRoleByIdQuery(id);
      const role = await this.getByIdHandler.execute(query);

      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      res.status(200).json({
        id: role.id,
        name: role.name,
        code: role.code,
        description: role.description,
        isActive: role.isActive,
        permissions: role.permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const query = new GetAllRolesQuery(includeInactive);
      const roles = await this.getAllHandler.execute(query);

      const response = roles.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        description: r.description,
        isActive: r.isActive,
        permissionsCount: r.permissions?.length || 0,
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

