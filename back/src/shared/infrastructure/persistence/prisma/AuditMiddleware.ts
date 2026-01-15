import { Prisma } from '../../../../identity/infrastructure/persistence/prisma/client';
import { AsyncContext } from '../../async-context/AsyncContext';

export const auditMiddleware: Prisma.Middleware = async (params, next) => {
    const { model, action, args } = params;

    // Skip audit logging for the AuditLog model itself to prevent recursion
    if (model === 'AuditLog') {
        return next(params);
    }

    // Only audit mutation actions
    const auditedActions = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany', 'upsert'];
    if (!auditedActions.includes(action)) {
        return next(params);
    }

    const result = await next(params);

    try {
        const userId = AsyncContext.getUserId();
        const ipAddress = AsyncContext.getIpAddress();
        const userAgent = AsyncContext.getUserAgent();
        // For bulk operations, we might not have a single entityId. 
        // We'll store what we can.
        let entityId = 'batch';
        if (result && typeof result === 'object' && 'id' in result) {
            entityId = (result as any).id;
        }

        // We need to use the Prisma Client from the context where use() was called.
        // However, since we are inside the middleware, we can access the client if we bind it or import it.
        // But standard middleware doesn't expose the client instance easily if not passed.
        // We will assume the existence of a global prisma or we will reuse the `params.client` if available (it isn't).

        // Workaround: We cannot safely call `prisma.auditLog.create` here if it triggers *another* middleware (recursion).
        // We already checked `if (model === 'AuditLog')`.

        // Note: We need to import the DI Container's prisma or similar to write the log.
        // Importing `container` here might cause circular deps if DIContainer imports this middleware.
        // So we should probably define this middleware factor that TAKES the prisma client.
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }

    return result;
};

// Factory function solution to avoid circular dependency
export const createAuditMiddleware = (prismaClient: any): Prisma.Middleware => {
    return async (params, next) => {
        const { model, action, args } = params;

        if (model === 'AuditLog' || !model) {
            return next(params);
        }

        const auditedActions = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany', 'upsert'];
        if (!auditedActions.includes(action)) {
            return next(params);
        }

        const start = Date.now();
        console.log(`[AuditMiddleware] Intercepting ${action} on ${model}`);
        const result = await next(params);
        console.log(`[AuditMiddleware] Operation finished in ${Date.now() - start}ms`);
        // Log asynchronously to not block the response significantly? 
        // Ideally await it to ensure integrity.

        // Use async/await but catch errors so we don't fail the main operation
        (async () => {
            try {
                const userId = AsyncContext.getUserId();
                const ipAddress = AsyncContext.getIpAddress();
                const userAgent = AsyncContext.getUserAgent();

                let entityId = 'multiple';
                if (result && typeof result === 'object' && 'id' in result) {
                    entityId = String((result as any).id);
                }

                // Sanitize args to remove sensitive data
                const sanitize = (obj: any): any => {
                    if (!obj) return obj;
                    if (Array.isArray(obj)) return obj.map(sanitize);
                    if (typeof obj === 'object') {
                        const newObj: any = {};
                        for (const key in obj) {
                            if (['password', 'token', 'secret'].includes(key.toLowerCase())) {
                                newObj[key] = '[REDACTED]';
                            } else {
                                newObj[key] = sanitize(obj[key]);
                            }
                        }
                        return newObj;
                    }
                    return obj;
                };

                const details = {
                    args: sanitize(args),
                };

                console.log(`[AuditMiddleware] Creating log for ${action} on ${model}, User: ${userId}`);
                await prismaClient.auditLog.create({
                    data: {
                        action: action.toUpperCase(),
                        entity: model,
                        entityId: entityId,
                        userId: userId || null,
                        details: JSON.stringify(details),
                        ipAddress: ipAddress,
                        userAgent: userAgent,
                    },
                });
                console.log('[AuditMiddleware] Log created successfully');
            } catch (error) {
                console.error('[AuditMiddleware] Failed to create audit log:', error);
            }
        })();

        return result;
    };
};
