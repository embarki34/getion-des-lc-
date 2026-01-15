import { Request, Response } from 'express';
import { ListGuaranteesQuery, ListGuaranteesQueryHandler } from '../../../application/queries/ListGuaranteesQuery';

export class GuaranteesController {
    constructor(private readonly listHandler: ListGuaranteesQueryHandler) { }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const query = new ListGuaranteesQuery();
            const result = await this.listHandler.execute(query);
            res.json({ success: true, data: result });
        } catch (error: any) {
            console.error('Error listing guarantees:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
