import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { createAuditMiddleware } from '../../../shared/infrastructure/persistence/prisma/AuditMiddleware';

// Repositories
import { PrismaCompanyRepository } from '../repositories/PrismaCompanyRepository';
import { PrismaBusinessUnitRepository } from '../repositories/PrismaBusinessUnitRepository';
import { PrismaSupplierRepository } from '../repositories/PrismaSupplierRepository';
import { PrismaCompanySupplierRepository } from '../repositories/PrismaCompanySupplierRepository';
import { PrismaBusinessUnitSupplierRepository } from '../repositories/PrismaBusinessUnitSupplierRepository';
import { PrismaCompanyBanqueRepository } from '../repositories/PrismaCompanyBanqueRepository';

// Command Handlers - Company
import { CreateCompanyCommandHandler } from '../../application/commands/CreateCompanyCommand';
import { UpdateCompanyCommandHandler } from '../../application/commands/UpdateCompanyCommand';
import { DeleteCompanyCommandHandler } from '../../application/commands/DeleteCompanyCommand';

// Query Handlers - Company
import { GetCompanyByIdQueryHandler } from '../../application/queries/GetCompanyByIdQuery';
import { GetAllCompaniesQueryHandler } from '../../application/queries/GetAllCompaniesQuery';

// Command Handlers - Business Unit
import { CreateBusinessUnitCommandHandler } from '../../application/commands/CreateBusinessUnitCommand';
import { UpdateBusinessUnitCommandHandler } from '../../application/commands/UpdateBusinessUnitCommand';
import { DeleteBusinessUnitCommandHandler } from '../../application/commands/DeleteBusinessUnitCommand';

// Query Handlers - Business Unit
import { GetBusinessUnitByIdQueryHandler } from '../../application/queries/GetBusinessUnitByIdQuery';
import { GetAllBusinessUnitsQueryHandler } from '../../application/queries/GetAllBusinessUnitsQuery';

// Command Handlers - Supplier
import { CreateSupplierCommandHandler } from '../../application/commands/CreateSupplierCommand';
import { UpdateSupplierCommandHandler } from '../../application/commands/UpdateSupplierCommand';
import { DeleteSupplierCommandHandler } from '../../application/commands/DeleteSupplierCommand';

// Query Handlers - Supplier
import { GetSupplierByIdQueryHandler } from '../../application/queries/GetSupplierByIdQuery';
import { GetAllSuppliersQueryHandler } from '../../application/queries/GetAllSuppliersQuery';

// Assignment Command Handlers
import { AssignSupplierToCompanyCommandHandler } from '../../application/commands/AssignSupplierToCompanyCommand';
import { AssignSupplierToBusinessUnitCommandHandler } from '../../application/commands/AssignSupplierToBusinessUnitCommand';

// Controllers
import { CompanyController } from '../controllers/CompanyController';
import { BusinessUnitController } from '../controllers/BusinessUnitController';
import { SupplierController } from '../controllers/SupplierController';

export class CompanyDIContainer {
  private static instance: CompanyDIContainer;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(createAuditMiddleware(this.prisma));
  }

  public static getInstance(): CompanyDIContainer {
    if (!CompanyDIContainer.instance) {
      CompanyDIContainer.instance = new CompanyDIContainer();
    }
    return CompanyDIContainer.instance;
  }

  // Repositories
  public getCompanyRepository() {
    return new PrismaCompanyRepository(this.prisma);
  }

  public getBusinessUnitRepository() {
    return new PrismaBusinessUnitRepository(this.prisma);
  }

  public getSupplierRepository() {
    return new PrismaSupplierRepository(this.prisma);
  }

  public getCompanySupplierRepository() {
    return new PrismaCompanySupplierRepository(this.prisma);
  }

  public getBusinessUnitSupplierRepository() {
    return new PrismaBusinessUnitSupplierRepository(this.prisma);
  }

  public getCompanyBanqueRepository() {
    return new PrismaCompanyBanqueRepository(this.prisma);
  }

  // Company Command Handlers
  public getCreateCompanyHandler() {
    return new CreateCompanyCommandHandler(this.getCompanyRepository());
  }

  public getUpdateCompanyHandler() {
    return new UpdateCompanyCommandHandler(this.getCompanyRepository());
  }

  public getDeleteCompanyHandler() {
    return new DeleteCompanyCommandHandler(this.getCompanyRepository());
  }

  // Company Query Handlers
  public getGetCompanyByIdHandler() {
    return new GetCompanyByIdQueryHandler(this.getCompanyRepository());
  }

  public getGetAllCompaniesHandler() {
    return new GetAllCompaniesQueryHandler(this.getCompanyRepository());
  }

  // Business Unit Command Handlers
  public getCreateBusinessUnitHandler() {
    return new CreateBusinessUnitCommandHandler(
      this.getBusinessUnitRepository(),
      this.getCompanyRepository()
    );
  }

  public getUpdateBusinessUnitHandler() {
    return new UpdateBusinessUnitCommandHandler(
      this.getBusinessUnitRepository(),
      this.getCompanyRepository()
    );
  }

  public getDeleteBusinessUnitHandler() {
    return new DeleteBusinessUnitCommandHandler(this.getBusinessUnitRepository());
  }

  // Business Unit Query Handlers
  public getGetBusinessUnitByIdHandler() {
    return new GetBusinessUnitByIdQueryHandler(this.getBusinessUnitRepository());
  }

  public getGetAllBusinessUnitsHandler() {
    return new GetAllBusinessUnitsQueryHandler(this.getBusinessUnitRepository());
  }

  // Supplier Command Handlers
  public getCreateSupplierHandler() {
    return new CreateSupplierCommandHandler(this.getSupplierRepository());
  }

  public getUpdateSupplierHandler() {
    return new UpdateSupplierCommandHandler(this.getSupplierRepository());
  }

  public getDeleteSupplierHandler() {
    return new DeleteSupplierCommandHandler(this.getSupplierRepository());
  }

  // Supplier Query Handlers
  public getGetSupplierByIdHandler() {
    return new GetSupplierByIdQueryHandler(this.getSupplierRepository());
  }

  public getGetAllSuppliersHandler() {
    return new GetAllSuppliersQueryHandler(this.getSupplierRepository());
  }

  // Assignment Command Handlers
  public getAssignSupplierToCompanyHandler() {
    return new AssignSupplierToCompanyCommandHandler(
      this.getCompanySupplierRepository(),
      this.getCompanyRepository(),
      this.getSupplierRepository()
    );
  }

  public getAssignSupplierToBusinessUnitHandler() {
    return new AssignSupplierToBusinessUnitCommandHandler(
      this.getBusinessUnitSupplierRepository(),
      this.getBusinessUnitRepository(),
      this.getSupplierRepository()
    );
  }

  // Controllers
  public getCompanyController() {
    return new CompanyController(
      this.getCreateCompanyHandler(),
      this.getUpdateCompanyHandler(),
      this.getDeleteCompanyHandler(),
      this.getGetCompanyByIdHandler(),
      this.getGetAllCompaniesHandler()
    );
  }

  public getBusinessUnitController() {
    return new BusinessUnitController(
      this.getCreateBusinessUnitHandler(),
      this.getUpdateBusinessUnitHandler(),
      this.getDeleteBusinessUnitHandler(),
      this.getGetBusinessUnitByIdHandler(),
      this.getGetAllBusinessUnitsHandler(),
      this.getGetAllCompaniesHandler(),
      this.getGetCompanyByIdHandler()
    );
  }

  public getSupplierController() {
    return new SupplierController(
      this.getCreateSupplierHandler(),
      this.getUpdateSupplierHandler(),
      this.getDeleteSupplierHandler(),
      this.getGetSupplierByIdHandler(),
      this.getGetAllSuppliersHandler()
    );
  }
}

