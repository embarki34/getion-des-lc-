import { Request, Response, NextFunction } from 'express';
import { GetAuditLogsUseCase } from '../../../application/use-cases/GetAuditLogsUseCase';
import { AuditLogFilter } from '../../../domain/repositories/IAuditLogRepository';

export class AuditLogController {
    constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) { }

    getLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: AuditLogFilter = {
                userId: req.query.userId as string,
                action: req.query.action as string,
                entity: req.query.entity as string,
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : 50,
                offset: req.query.offset ? Number(req.query.offset) : 0,
            };

            const result = await this.getAuditLogsUseCase.execute(filters);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}
