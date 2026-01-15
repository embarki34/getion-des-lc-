import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../services/JwtTokenService";
import { ErrorCodes } from "../../../../shared/errors/ErrorCodes";
import { AsyncContext } from "../../../../shared/infrastructure/async-context/AsyncContext";

/**
 * Extended Express Request with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware
 * Validates JWT access token and attaches user info to request
 */
export class AuthenticationMiddleware {
  constructor(private readonly tokenService: JwtTokenService) { }

  /**
   * Middleware function to authenticate requests
   */
  authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      // Extract token from Authorization header
      const authHeader = req.header("Authorization");

      if (!authHeader) {
        res.status(401).json({
          error: {
            code: ErrorCodes.UNAUTHORIZED,
            message: "No authorization header provided",
          },
        });
        return;
      }

      // Check Bearer token format
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        res.status(401).json({
          error: {
            code: ErrorCodes.UNAUTHORIZED,
            message: "Invalid authorization header format. Use: Bearer <token>",
          },
        });
        return;
      }

      const token = parts[1];

      // Verify token
      const payload = this.tokenService.verifyAccessToken(token);

      // Attach user info to request
      (req as AuthenticatedRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      // Set context for Prisma audit logging
      AsyncContext.setUserId(payload.userId);
      console.log(`[AuthMiddleware] Set AsyncContext userId: ${payload.userId}`);

      next();
    } catch (error: any) {
      res.status(401).json({
        error: {
          code: error.code || ErrorCodes.INVALID_TOKEN,
          message: error.message || "Invalid or expired token",
        },
      });
    }
  };

  /**
   * Optional authentication - doesn't fail if no token provided
   */
  optionalAuthenticate = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.header("Authorization");

      if (!authHeader) {
        next();
        return;
      }

      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1];
        const payload = this.tokenService.verifyAccessToken(token);

        (req as AuthenticatedRequest).user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };

        // Set context for Prisma audit logging
        AsyncContext.setUserId(payload.userId);
      }

      next();
    } catch (error) {
      // Ignore errors for optional authentication
      next();
    }
  };
}
