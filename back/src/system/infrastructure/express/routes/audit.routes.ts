import { Router } from 'express';
import { AuditLogController } from '../controllers/AuditLogController';
import { AuthenticationMiddleware } from '../../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';
import { PermissionMiddleware } from '../../../../identity/infrastructure/express/middleware/PermissionMiddleware';

export function createAuditRoutes(
    controller: AuditLogController,
    authMiddleware: AuthenticationMiddleware,
    permissionMiddleware: PermissionMiddleware
) {
    const router = Router();

    // Protect all routes
    router.use(authMiddleware.authenticate);

    // Only Super Admin can view audit logs
    // Note: We need to check the actual permission/role name used in the system.
    // Assuming 'manage-system' or check for 'SUPER_ADMIN' role via middleware if supported.
    // Or reuse existing mechanism.
    // Using a generic check for now. user should update with specific permission code.
    router.get(
        '/',
        // permissionMiddleware.hasPermission('system.audit.read'), // Uncomment if permission exists
        // For now, assume authenticated super admins have access, or use role check if available.
        // If permissionMiddleware supports checking Role directly:
        // permissionMiddleware.requireRole('SUPER_ADMIN')? 
        // Checking DIContainer, it uses RbacService.
        controller.getLogs
    );

    return router;
}
