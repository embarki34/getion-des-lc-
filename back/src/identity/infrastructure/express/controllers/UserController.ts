import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/AuthenticationMiddleware";
import { GetUserProfileUseCase } from "../../../application/use-cases/user-management/GetUserProfileUseCase";
import { ChangePasswordUseCase } from "../../../application/use-cases/user-management/ChangePasswordUseCase";
import { ChangePasswordRequest } from "../../../application/dtos/Requests";

import { GetUsersByBusinessUnitUseCase } from "../../../application/use-cases/user-management/GetUsersByBusinessUnitUseCase";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-management/GetAllUsersUseCase";
import { UpdateUserUseCase, UpdateUserRequest } from "../../../application/use-cases/user-management/UpdateUserUseCase";
import { ResetUserPasswordUseCase, ResetUserPasswordRequest } from "../../../application/use-cases/user-management/ResetUserPasswordUseCase";
import { DeleteUserUseCase, DeleteUserRequest } from "../../../application/use-cases/user-management/DeleteUserUseCase";

/**
 * User controller
 * Handles user management HTTP requests
 */
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUsersByBusinessUnitUseCase: GetUsersByBusinessUnitUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly resetUserPasswordUseCase: ResetUserPasswordUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) { }

  /**
   * GET /api/v1/users
   * Get all users
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getAllUsersUseCase.execute();

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const users = result.getValue();
      const response = users.map(profile => ({
        id: profile.getId().getValue(),
        name: profile.getName(),
        email: profile.getEmail().getValue(),
        role: profile.getRole(),
        status: profile.getStatus(),
        emailVerified: profile.isEmailVerified(),
        createdAt: profile.getCreatedAt(),
        lastLoginAt: profile.getLastLoginAt(),
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/business-unit/:businessUnitId
   * Get users by Business Unit ID
   */
  getUsersByBusinessUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { businessUnitId } = req.params;

      const result = await this.getUsersByBusinessUnitUseCase.execute(businessUnitId);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const users = result.getValue();

      const response = users.map(profile => ({
        id: profile.getId().getValue(),
        name: profile.getName(),
        email: profile.getEmail().getValue(),
        role: profile.getRole(),
        status: profile.getStatus(),
        emailVerified: profile.isEmailVerified(),
        createdAt: profile.getCreatedAt(),
        lastLoginAt: profile.getLastLoginAt(),
      }));

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/me
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    try {
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const result = await this.getUserProfileUseCase.execute(
        authReq.user.userId
      );

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const profile = result.getValue();

      res.status(200).json({
        success: true,
        data: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          emailVerified: profile.emailVerified,
          createdAt: profile.createdAt,
          lastLoginAt: profile.lastLoginAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/me/password
   * Change user password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    try {
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Validate request body
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Current password and new password are required",
          },
        });
        return;
      }

      // Create request DTO
      const request = new ChangePasswordRequest(
        authReq.user.userId,
        currentPassword,
        newPassword
      );

      // Execute use case
      const result = await this.changePasswordUseCase.execute(request);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const response = result.getValue();

      res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/:id
   * Get user by ID (admin only)
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await this.getUserProfileUseCase.execute(id);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const profile = result.getValue();

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            emailVerified: profile.emailVerified,
            createdAt: profile.createdAt,
            lastLoginAt: profile.lastLoginAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/:id
   * Update user information
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, role, status } = req.body;

      const updateRequest: UpdateUserRequest = {
        userId: id,
        name,
        role,
        status,
      };

      const result = await this.updateUserUseCase.execute(updateRequest);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/users/:id/reset-password
   * Reset user password (admin only)
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    try {
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const { id } = req.params;
      const { newPassword, sendEmail } = req.body;

      // Validate request body
      if (!newPassword) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "New password is required",
          },
        });
        return;
      }

      // Create request DTO
      const resetRequest: ResetUserPasswordRequest = {
        adminId: authReq.user.userId,
        targetUserId: id,
        newPassword,
        sendEmail: sendEmail !== false, // Default to true
      };

      // Execute use case
      const result = await this.resetUserPasswordUseCase.execute(resetRequest);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      const response = result.getValue();

      res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * DELETE /api/v1/users/:id
   * Delete user
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    try {
      if (!authReq.user) {
        res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        });
        return;
      }

      const { id } = req.params;

      const request: DeleteUserRequest = {
        targetUserId: id,
        adminId: authReq.user.userId,
      };

      const result = await this.deleteUserUseCase.execute(request);

      if (result.isFailure()) {
        const error = result.getError();
        next(error);
        return;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

