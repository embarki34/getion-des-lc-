import { AuditLog } from '../../../identity/infrastructure/persistence/prisma/client';

export interface AuditLogFilter {
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

export interface IAuditLogRepository {
    find(filter: AuditLogFilter): Promise<{ logs: AuditLog[]; total: number }>;
}
