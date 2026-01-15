import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../../../shared/errors/BaseError";
import { DomainException } from "../../../domain/exceptions/DomainExceptions";
import { ErrorCodes } from "../../../../shared/errors/ErrorCodes";

/**
 * Error response interface
 */
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
    path?: string;
  };
}

/**
 * Global error handler middleware
 * Catches all errors and formats them consistently
 */
export class ErrorHandlerMiddleware {
  /**
   * Handle errors
   */
  static handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error("[Error]", {
      name: error.name,
      message: error.message,
      code: (error as any).code, // Log code if available
      stack: error.stack,
      path: req.path,
      method: req.method,
    });

    // Handle domain exceptions
    if (error instanceof DomainException) {
      const response: ErrorResponse = {
        error: {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp.toISOString(),
          path: req.path,
        },
      };

      res
        .status(ErrorHandlerMiddleware.getStatusCode(error.code))
        .json(response);
      return;
    }

    // Handle base errors
    if (error instanceof BaseError) {
      const response: ErrorResponse = {
        error: {
          code: error.code,
          message: error.message,
          timestamp: error.timestamp.toISOString(),
          path: req.path,
        },
      };

      res
        .status(ErrorHandlerMiddleware.getStatusCode(error.code))
        .json(response);
      return;
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const response: ErrorResponse = {
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: error.message,
          timestamp: new Date().toISOString(),
          path: req.path,
        },
      };

      res.status(400).json(response);
      return;
    }

    // Handle generic errors
    const response: ErrorResponse = {
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message:
          process.env.NODE_ENV === "production"
            ? "An internal error occurred"
            : error.message,
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    };

    res.status(500).json(response);
  }

  /**
   * Maps error codes to HTTP status codes
   */
  private static getStatusCode(errorCode: string): number {
    const statusMap: Record<string, number> = {
      // Validation errors (400)
      [ErrorCodes.VALIDATION_ERROR]: 400,
      [ErrorCodes.INVALID_EMAIL_FORMAT]: 400,
      [ErrorCodes.INVALID_PASSWORD_FORMAT]: 400,
      [ErrorCodes.PASSWORD_TOO_WEAK]: 400,
      [ErrorCodes.INVALID_USER_ID]: 400,

      // Authentication errors (401)
      [ErrorCodes.INVALID_CREDENTIALS]: 401,
      [ErrorCodes.INVALID_TOKEN]: 401,
      [ErrorCodes.TOKEN_EXPIRED]: 401,
      [ErrorCodes.UNAUTHORIZED]: 401,

      // Account status errors (403)
      [ErrorCodes.ACCOUNT_LOCKED]: 403,
      [ErrorCodes.EMAIL_NOT_VERIFIED]: 403,
      [ErrorCodes.ACCOUNT_DEACTIVATED]: 403,
      [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 403,
      [ErrorCodes.FORBIDDEN]: 403,

      // Not found errors (404)
      [ErrorCodes.USER_NOT_FOUND]: 404,

      // Conflict errors (409)
      [ErrorCodes.USER_ALREADY_EXISTS]: 409,

      // Server errors (500)
      [ErrorCodes.INTERNAL_ERROR]: 500,
      [ErrorCodes.DATABASE_ERROR]: 500,
      [ErrorCodes.EMAIL_SERVICE_ERROR]: 500,
    };

    return statusMap[errorCode] || 500;
  }
}
