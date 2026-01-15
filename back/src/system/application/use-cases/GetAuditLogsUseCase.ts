import { IAuditLogRepository, AuditLogFilter } from '../../domain/repositories/IAuditLogRepository';

export class GetAuditLogsUseCase {
    constructor(private readonly auditLogRepository: IAuditLogRepository) { }

    async execute(filter: AuditLogFilter) {
        return this.auditLogRepository.find(filter);
    }
}
