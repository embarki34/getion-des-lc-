import { Request, Response, NextFunction } from 'express';
import { CreateBusinessUnitCommand, CreateBusinessUnitCommandHandler } from '../../application/commands/CreateBusinessUnitCommand';
import { UpdateBusinessUnitCommand, UpdateBusinessUnitCommandHandler } from '../../application/commands/UpdateBusinessUnitCommand';
import { DeleteBusinessUnitCommand, DeleteBusinessUnitCommandHandler } from '../../application/commands/DeleteBusinessUnitCommand';
import { GetBusinessUnitByIdQuery, GetBusinessUnitByIdQueryHandler } from '../../application/queries/GetBusinessUnitByIdQuery';
import { GetAllBusinessUnitsQuery, GetAllBusinessUnitsQueryHandler } from '../../application/queries/GetAllBusinessUnitsQuery';
import { GetAllCompaniesQuery, GetAllCompaniesQueryHandler } from '../../application/queries/GetAllCompaniesQuery';
import { GetCompanyByIdQuery, GetCompanyByIdQueryHandler } from '../../application/queries/GetCompanyByIdQuery';

export class BusinessUnitController {
  constructor(
    private readonly createHandler: CreateBusinessUnitCommandHandler,
    private readonly updateHandler: UpdateBusinessUnitCommandHandler,
    private readonly deleteHandler: DeleteBusinessUnitCommandHandler,
    private readonly getByIdHandler: GetBusinessUnitByIdQueryHandler,
    private readonly getAllHandler: GetAllBusinessUnitsQueryHandler,
    private readonly getAllCompaniesHandler: GetAllCompaniesQueryHandler,
    private readonly getCompanyByIdHandler: GetCompanyByIdQueryHandler
  ) { }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command = new CreateBusinessUnitCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Business unit created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new UpdateBusinessUnitCommand(id, req.body);
      await this.updateHandler.execute(command);
      res.status(200).json({ message: 'Business unit updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteBusinessUnitCommand(id);
      await this.deleteHandler.execute(command);
      res.status(200).json({ message: 'Business unit deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetBusinessUnitByIdQuery(id);
      const businessUnit = await this.getByIdHandler.execute(query);

      if (!businessUnit) {
        res.status(404).json({ message: 'Business unit not found' });
        return;
      }

      let companyName = '';
      if (businessUnit.companyId) {
        const company = await this.getCompanyByIdHandler.execute(new GetCompanyByIdQuery(businessUnit.companyId));
        if (company) companyName = company.name;
      }

      res.status(200).json({
        id: businessUnit.id,
        name: businessUnit.name,
        code: businessUnit.code,
        description: businessUnit.description,
        companyId: businessUnit.companyId,
        companyName,
        isActive: businessUnit.isActive,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.query.companyId as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const query = new GetAllBusinessUnitsQuery(companyId, includeInactive);
      const businessUnits = await this.getAllHandler.execute(query);

      // Fetch all companies to map names (optimized: fetch all once)
      // Ideally we should use a "GetCompaniesByIds" query, but GetAll is acceptable for now given assumed list size
      const companies = await this.getAllCompaniesHandler.execute(new GetAllCompaniesQuery(true));
      const companyMap = new Map(companies.map(c => [c.id, c.name]));

      const response = businessUnits.map((bu) => ({
        id: bu.id,
        name: bu.name,
        code: bu.code,
        description: bu.description,
        companyId: bu.companyId,
        companyName: companyMap.get(bu.companyId) || 'Unknown',
        isActive: bu.isActive,
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

