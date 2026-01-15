import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthenticationMiddleware } from "../middleware/AuthenticationMiddleware";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { AuthorizationMiddleware } from "../middleware/AuthorizationMiddleware";
import { UserRole } from "../../../domain/value-objects/UserRole";

/**
 * Creates user routes
 */
export function createUserRoutes(
  userController: UserController,
  authMiddleware: AuthenticationMiddleware,
  permissionMiddleware: PermissionMiddleware
): Router {
  const router = Router();

  /**
   * @swagger
   * /users:
   *   get:
   *     tags: [Users]
   *     summary: Get all users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get(
    "/",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:read:all', 'user:read:company', 'user:read:business-unit']),
    userController.getAllUsers
  );

  /**
   * @swagger
   * /users/me:
   *   get:
   *     tags: [Users]
   *     summary: Get current user profile
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get(
    "/me",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission('user:read:own'),
    userController.getProfile
  );

  /**
   * @swagger
   * /users/business-unit/{businessUnitId}:
   *   get:
   *     tags: [Users]
   *     summary: Get users by Business Unit ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: businessUnitId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   */
  router.get(
    "/business-unit/:businessUnitId",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:read:business-unit', 'user:read:company', 'user:read:all']),
    userController.getUsersByBusinessUnit
  );

  /**
   * @swagger
   * /users/me/password:
   *   put:
   *     tags: [Users]
   *     summary: Change current user password
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 format: password
   *               newPassword:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  router.put(
    "/me/password",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission('user:update:own'),
    userController.changePassword
  );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Get user by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details retrieved successfully
   *       404:
   *         description: User not found
   */
  router.get(
    "/:id",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:read:all', 'user:read:company', 'user:read:business-unit']),
    userController.getUserById
  );

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags: [Users]
   *     summary: Update user information
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               role:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       404:
   *         description: User not found
   */
  router.put(
    "/:id",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:update:all', 'user:update:company', 'user:update:business-unit', 'user:update:own']),
    userController.updateUser
  );

  /**
   * @swagger
   * /users/{id}/reset-password:
   *   post:
   *     tags: [Users]
   *     summary: Reset user password (admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - newPassword
   *             properties:
   *               newPassword:
   *                 type: string
   *                 format: password
   *                 description: New password for the user
   *               sendEmail:
   *                 type: boolean
   *                 description: Send email notification to user (default true)
   *     responses:
   *       200:
   *         description: Password reset successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Insufficient permissions
   */
  router.post(
    "/:id/reset-password",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:reset-password:all', 'user:reset-password:company', 'user:reset-password:business-unit']),
    userController.resetPassword
  );

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags: [Users]
   *     summary: Delete user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Insufficient permissions
   *       404:
   *         description: User not found
   */
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:delete:all', 'user:delete:company', 'user:delete:business-unit']),
    userController.deleteUser
  );

  return router;
}
