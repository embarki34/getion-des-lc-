import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { PermissionController } from '../controllers/PermissionController';
import { UserRoleController } from '../controllers/UserRoleController';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';
import { PermissionMiddleware } from '../middleware/PermissionMiddleware';


export const createRbacRoutes = (
  roleController: RoleController,
  permissionController: PermissionController,
  userRoleController: UserRoleController,
  authMiddleware: AuthenticationMiddleware,
  permissionMiddleware: PermissionMiddleware
): Router => {
  const router = Router();

  // Permission Routes
  /**
   * @swagger
   * /rbac/permissions:
   *   get:
   *     tags: [RBAC]
   *     summary: Get all permissions
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of permissions retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/permissions',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['role:read:all', 'role:create:all', 'role:update:all']),
    permissionController.getAll.bind(permissionController)
  );

  // Role Routes
  /**
   * @swagger
   * /rbac/roles:
   *   post:
   *     tags: [RBAC]
   *     summary: Create a new role
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - code
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Administrator"
   *               code:
   *                 type: string
   *                 example: "ADMIN"
   *               description:
   *                 type: string
   *                 example: "Full system access"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       201:
   *         description: Role created successfully
   *       400:
   *         description: Bad request
   */
  router.post(
    '/roles',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission('role:create:all'),
    roleController.create.bind(roleController)
  );

  /**
   * @swagger
   * /rbac/roles:
   *   get:
   *     tags: [RBAC]
   *     summary: Get all roles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of roles retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/roles',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['role:read:all']),
    roleController.getAll.bind(roleController)
  );
  /**
   * @swagger
   * /rbac/roles/{id}:
   *   get:
   *     tags: [RBAC]
   *     summary: Get role by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     responses:
   *       200:
   *         description: Role details retrieved successfully
   *       404:
   *         description: Role not found
   */
  router.get(
    '/roles/:id',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['role:read:all']),
    roleController.getById.bind(roleController)
  );

  /**
   * @swagger
   * /rbac/roles/{id}:
   *   put:
   *     tags: [RBAC]
   *     summary: Update a role
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               isActive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Role updated successfully
   *       404:
   *         description: Role not found
   */
  router.put(
    '/roles/:id',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission('role:update:all'),
    roleController.update.bind(roleController)
  );

  /**
   * @swagger
   * /rbac/roles/{id}:
   *   delete:
   *     tags: [RBAC]
   *     summary: Delete a role
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     responses:
   *       200:
   *         description: Role deleted successfully
   *       404:
   *         description: Role not found
   */
  router.delete(
    '/roles/:id',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission('role:delete:all'),
    roleController.delete.bind(roleController)
  );

  // User-Role Routes
  /**
   * @swagger
   * /rbac/users/{userId}/roles:
   *   post:
   *     tags: [RBAC]
   *     summary: Assign role to user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
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
   *               - roleId
   *             properties:
   *               roleId:
   *                 type: string
   *                 description: ID of the role to assign
   *     responses:
   *       200:
   *         description: Role assigned successfully
   *       404:
   *         description: User or Role not found
   */
  router.post(
    '/users/:userId/roles',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:assign-role:all', 'user:assign-role:company', 'user:assign-role:business-unit']),
    userRoleController.assignRole.bind(userRoleController)
  );

  /**
   * @swagger
   * /rbac/users/{userId}/roles/{roleId}:
   *   delete:
   *     tags: [RBAC]
   *     summary: Remove role from user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *       - in: path
   *         name: roleId
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     responses:
   *       200:
   *         description: Role removed successfully
   *       404:
   *         description: User or Role not found
   */
  router.delete(
    '/users/:userId/roles/:roleId',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:assign-role:all', 'user:assign-role:company', 'user:assign-role:business-unit']),
    userRoleController.removeRole.bind(userRoleController)
  );

  /**
   * @swagger
   * /rbac/users/{userId}/roles:
   *   get:
   *     tags: [RBAC]
   *     summary: Get user roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: List of user roles retrieved successfully
   *       404:
   *         description: User not found
   */
  router.get(
    '/users/:userId/roles',
    authMiddleware.authenticate,
    permissionMiddleware.requirePermission(['user:read:all', 'user:read:company', 'user:read:business-unit']),
    userRoleController.getUserRoles.bind(userRoleController)
  );

  return router;
};

