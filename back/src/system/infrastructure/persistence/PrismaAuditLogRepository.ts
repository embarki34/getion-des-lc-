import { PrismaClient, AuditLog } from '../../../identity/infrastructure/persistence/prisma/client';
import { IAuditLogRepository, AuditLogFilter } from '../../domain/repositories/IAuditLogRepository';

export class PrismaAuditLogRepository implements IAuditLogRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async find(filter: AuditLogFilter): Promise<{ logs: AuditLog[]; total: number }> {
        const { userId, action, entity, startDate, endDate, limit = 50, offset = 0 } = filter;

        const where: any = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entity) where.entity = entity;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = startDate;
            if (endDate) where.createdAt.lte = endDate;
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return { logs, total };
    }
}
