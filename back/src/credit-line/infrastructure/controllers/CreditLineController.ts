import { Request, Response, NextFunction } from 'express';
import { CreateCreditLineCommandHandler } from '../../application/commands/CreateCreditLineCommand';
import { ListCreditLinesQueryHandler } from '../../application/queries/ListCreditLinesQuery';
import { CalculateDisponibiliteQueryHandler } from '../../application/queries/CalculateDisponibiliteQuery';
import { GetCreditLineByIdQueryHandler } from '../../application/queries/GetCreditLineByIdQuery';
import { DeleteCreditLineCommandHandler } from '../../application/commands/DeleteCreditLineCommand';
import { UpdateCreditLineCommandHandler } from '../../application/commands/UpdateCreditLineCommand';

export class CreditLineController {
  constructor(
    private readonly createHandler: CreateCreditLineCommandHandler,
    private readonly listHandler: ListCreditLinesQueryHandler,
    private readonly disponibiliteHandler: CalculateDisponibiliteQueryHandler,
    private readonly getByIdHandler: GetCreditLineByIdQueryHandler,
    private readonly deleteHandler: DeleteCreditLineCommandHandler,
    private readonly updateHandler: UpdateCreditLineCommandHandler
  ) { }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { DeleteCreditLineCommand } =
        await import('../../application/commands/DeleteCreditLineCommand');
      const command = new DeleteCreditLineCommand(req.params.id);
      await this.deleteHandler.execute(command);
      res.status(200).json({ message: 'Credit line deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { UpdateCreditLineCommand } =
        await import('../../application/commands/UpdateCreditLineCommand');
      const command = new UpdateCreditLineCommand(req.params.id, req.body);
      await this.updateHandler.execute(command);
      res.status(200).json({ message: 'Credit line updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { CreateCreditLineCommand } =
        await import('../../application/commands/CreateCreditLineCommand');
      const command = new CreateCreditLineCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Credit line created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ListCreditLinesQuery } =
        await import('../../application/queries/ListCreditLinesQuery');
      const query = new ListCreditLinesQuery(req.query.banqueId as string);
      const result = await this.listHandler.execute(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { GetCreditLineByIdQuery } =
        await import('../../application/queries/GetCreditLineByIdQuery');
      const query = new GetCreditLineByIdQuery(req.params.id);
      const result = await this.getByIdHandler.execute(query);

      if (!result) {
        res.status(404).json({ message: 'Credit line not found' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDisponibilite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { CalculateDisponibiliteQuery } =
        await import('../../application/queries/CalculateDisponibiliteQuery');
      const query = new CalculateDisponibiliteQuery(req.params.id);
      const result = await this.disponibiliteHandler.execute(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
