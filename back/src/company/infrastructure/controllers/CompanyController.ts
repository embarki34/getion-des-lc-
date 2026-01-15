import { Request, Response, NextFunction } from 'express';
import { CreateCompanyCommand, CreateCompanyCommandHandler } from '../../application/commands/CreateCompanyCommand';
import { UpdateCompanyCommand, UpdateCompanyCommandHandler } from '../../application/commands/UpdateCompanyCommand';
import { DeleteCompanyCommand, DeleteCompanyCommandHandler } from '../../application/commands/DeleteCompanyCommand';
import { GetCompanyByIdQuery, GetCompanyByIdQueryHandler } from '../../application/queries/GetCompanyByIdQuery';
import { GetAllCompaniesQuery, GetAllCompaniesQueryHandler } from '../../application/queries/GetAllCompaniesQuery';

export class CompanyController {
  constructor(
    private readonly createHandler: CreateCompanyCommandHandler,
    private readonly updateHandler: UpdateCompanyCommandHandler,
    private readonly deleteHandler: DeleteCompanyCommandHandler,
    private readonly getByIdHandler: GetCompanyByIdQueryHandler,
    private readonly getAllHandler: GetAllCompaniesQueryHandler
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command = new CreateCompanyCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Company created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new UpdateCompanyCommand(id, req.body);
      await this.updateHandler.execute(command);
      res.status(200).json({ message: 'Company updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteCompanyCommand(id);
      await this.deleteHandler.execute(command);
      res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetCompanyByIdQuery(id);
      const company = await this.getByIdHandler.execute(query);

      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }

      res.status(200).json({
        id: company.id,
        name: company.name,
        code: company.code,
        description: company.description,
        address: company['props'].address,
        contactInfo: company['props'].contactInfo,
        parentCompanyId: company['props'].parentCompanyId,
        isActive: company.isActive,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const query = new GetAllCompaniesQuery(includeInactive);
      const companies = await this.getAllHandler.execute(query);

      const response = companies.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        description: c.description,
        address: c['props'].address,
        contactInfo: c['props'].contactInfo,
        parentCompanyId: c['props'].parentCompanyId,
        isActive: c.isActive,
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

