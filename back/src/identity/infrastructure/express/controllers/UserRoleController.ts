import { Request, Response, NextFunction } from 'express';
import { AssignRoleToUserCommand, AssignRoleToUserCommandHandler } from '../../../application/rbac/commands/AssignRoleToUserCommand';
import { GetUserRolesQuery, GetUserRolesQueryHandler } from '../../../application/rbac/queries/GetUserRolesQuery';
import { IUserRoleRepository } from '../../../domain/repositories/IUserRoleRepository';

export class UserRoleController {
  constructor(
    private readonly assignRoleHandler: AssignRoleToUserCommandHandler,
    private readonly getUserRolesHandler: GetUserRolesQueryHandler,
    private readonly userRoleRepository: IUserRoleRepository
  ) {}

  async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const command = new AssignRoleToUserCommand({
        userId,
        ...req.body,
      });
      await this.assignRoleHandler.execute(command);
      res.status(200).json({ message: 'Role assigned to user successfully' });
    } catch (error) {
      next(error);
    }
  }

  async removeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, roleId } = req.params;
      const { companyId, businessUnitId } = req.query;

      await this.userRoleRepository.removeRoleFromUser(
        userId,
        roleId,
        companyId as string | undefined,
        businessUnitId as string | undefined
      );

      res.status(200).json({ message: 'Role removed from user successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUserRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { companyId, businessUnitId } = req.query;

      const query = new GetUserRolesQuery(
        userId,
        companyId as string | undefined,
        businessUnitId as string | undefined
      );
      const roles = await this.getUserRolesHandler.execute(query);

      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }
}

