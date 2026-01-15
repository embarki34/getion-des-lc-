import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthenticationMiddleware";
import {
  UserRole,
  hasPermission,
} from "../../../domain/value-objects/UserRole";
import { ErrorCodes } from "../../../../shared/errors/ErrorCodes";

/**
 * Authorization middleware
 * Checks if authenticated user has required role or permission
 */
export class AuthorizationMiddleware {
  /**
   * Requires user to have one of the specified roles
   */
  static requireRole(...allowedRoles: UserRole[]) {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: ErrorCodes.UNAUTHORIZED,
            message: "Authentication required",
          },
        });
        return;
      }

      const userRole = authReq.user.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          error: {
            code: ErrorCodes.FORBIDDEN,
            message: "Insufficient permissions",
          },
        });
        return;
      }

      next();
    };
  }

  /**
   * Requires user to have a specific permission
   */
  static requirePermission(permission: string) {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: ErrorCodes.UNAUTHORIZED,
            message: "Authentication required",
          },
        });
        return;
      }

      const userRole = authReq.user.role as UserRole;

      if (!hasPermission(userRole, permission)) {
        res.status(403).json({
          error: {
            code: ErrorCodes.FORBIDDEN,
            message: "Insufficient permissions",
          },
        });
        return;
      }

      next();
    };
  }

  /**
   * Requires user to be admin
   */
  static requireAdmin() {
    return AuthorizationMiddleware.requireRole(UserRole.ADMIN);
  }

  /**
   * Requires user to be accessing their own resource
   */
  static requireOwnership(userIdParam: string = "userId") {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: ErrorCodes.UNAUTHORIZED,
            message: "Authentication required",
          },
        });
        return;
      }

      const resourceUserId = req.params[userIdParam] || req.body[userIdParam];

      // Allow if user is admin or accessing their own resource
      if (
        authReq.user.role === UserRole.ADMIN ||
        authReq.user.userId === resourceUserId
      ) {
        next();
        return;
      }

      res.status(403).json({
        error: {
          code: ErrorCodes.FORBIDDEN,
          message: "You can only access your own resources",
        },
      });
    };
  }
}
