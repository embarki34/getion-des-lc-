import { Request, Response, NextFunction } from 'express';
import { CreateSupplierCommand, CreateSupplierCommandHandler } from '../../application/commands/CreateSupplierCommand';
import { UpdateSupplierCommand, UpdateSupplierCommandHandler } from '../../application/commands/UpdateSupplierCommand';
import { DeleteSupplierCommand, DeleteSupplierCommandHandler } from '../../application/commands/DeleteSupplierCommand';
import { GetSupplierByIdQuery, GetSupplierByIdQueryHandler } from '../../application/queries/GetSupplierByIdQuery';
import { GetAllSuppliersQuery, GetAllSuppliersQueryHandler } from '../../application/queries/GetAllSuppliersQuery';

export class SupplierController {
  constructor(
    private readonly createHandler: CreateSupplierCommandHandler,
    private readonly updateHandler: UpdateSupplierCommandHandler,
    private readonly deleteHandler: DeleteSupplierCommandHandler,
    private readonly getByIdHandler: GetSupplierByIdQueryHandler,
    private readonly getAllHandler: GetAllSuppliersQueryHandler
  ) { }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command = new CreateSupplierCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Supplier created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new UpdateSupplierCommand(id, req.body);
      await this.updateHandler.execute(command);
      res.status(200).json({ message: 'Supplier updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteSupplierCommand(id);
      await this.deleteHandler.execute(command);
      res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetSupplierByIdQuery(id);
      const supplier = await this.getByIdHandler.execute(query);

      if (!supplier) {
        res.status(404).json({ message: 'Supplier not found' });
        return;
      }

      res.status(200).json({
        id: supplier.id,
        name: supplier.name,
        code: supplier.code,
        description: supplier.description,
        contactInfo: supplier.contactInfo,
        address: supplier.address,
        isActive: supplier.isActive,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessUnitId = req.query.businessUnitId as string | undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const query = new GetAllSuppliersQuery(businessUnitId, includeInactive);
      const suppliers = await this.getAllHandler.execute(query);

      const response = suppliers.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        description: s.description,
        contactInfo: s.contactInfo,
        address: s.address,
        isActive: s.isActive,
      }));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

