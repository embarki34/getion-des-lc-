import { Request, Response, NextFunction } from 'express';
import { IRbacService } from '../../../domain/services/IRbacService';
import { AuthenticatedRequest } from './AuthenticationMiddleware';

export interface PermissionOptions {
  permission: string;
  requireAll?: boolean; // If multiple permissions, require all or any
}

/**
 * Middleware to check if authenticated user has required permission(s)
 */
export class PermissionMiddleware {
  constructor(private readonly rbacService: IRbacService) { }

  requirePermission = (permission: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user) {
          res.status(401).json({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
          return;
        }

        const userId = authReq.user.userId;
        const permissions = Array.isArray(permission) ? permission : [permission];

        // Extract context from request (companyId, businessUnitId, etc.)
        const context = {
          companyId: req.body?.companyId || req.params?.companyId || (req.query?.companyId as string),
          businessUnitId: req.body?.businessUnitId || req.params?.businessUnitId || (req.query?.businessUnitId as string),
          resourceId: req.params?.id,
          resourceOwnerId: req.body?.ownerId || (req.query?.ownerId as string),
        };

        // Check permissions
        const hasPermission = await this.rbacService.hasAnyPermission(userId, permissions, context);

        if (!hasPermission) {
          res.status(403).json({
            error: {
              code: 'FORBIDDEN',
              message: `Access denied. Required permission(s): ${permissions.join(', ')}`,
            },
          });
          return;
        }

        next();
      } catch (error: any) {
        res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Error checking permissions',
          },
        });
      }
    };
  };
}

