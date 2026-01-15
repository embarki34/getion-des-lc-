import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { createAuditMiddleware } from '../../../shared/infrastructure/persistence/prisma/AuditMiddleware';

// Repositories
import { PrismaLigneDeCreditRepository } from '../repositories/PrismaLigneDeCreditRepository';
import { PrismaEngagementRepository } from '../../../utilization/infrastructure/repositories/PrismaEngagementRepository';
import { PrismaBanqueRepository } from '../../../bank-swift/infrastructure/repositories/PrismaBanqueRepository';

// Command Handlers
import { CreateCreditLineCommandHandler } from '../../application/commands/CreateCreditLineCommand';
import { DeleteCreditLineCommandHandler } from '../../application/commands/DeleteCreditLineCommand';
import { UpdateCreditLineCommandHandler } from '../../application/commands/UpdateCreditLineCommand';

// Query Handlers
import { ListCreditLinesQueryHandler } from '../../application/queries/ListCreditLinesQuery';
import { CalculateDisponibiliteQueryHandler } from '../../application/queries/CalculateDisponibiliteQuery';
import { GetCreditLineByIdQueryHandler } from '../../application/queries/GetCreditLineByIdQuery';

// Controllers
import { CreditLineController } from '../controllers/CreditLineController';

export class CreditLineDIContainer {
  private static instance: CreditLineDIContainer;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(createAuditMiddleware(this.prisma));
  }

  public static getInstance(): CreditLineDIContainer {
    if (!CreditLineDIContainer.instance) {
      CreditLineDIContainer.instance = new CreditLineDIContainer();
    }
    return CreditLineDIContainer.instance;
  }

  // Repositories
  public getLigneDeCreditRepository() {
    return new PrismaLigneDeCreditRepository(this.prisma);
  }

  public getEngagementRepository() {
    return new PrismaEngagementRepository(this.prisma);
  }

  public getBanqueRepository() {
    return new PrismaBanqueRepository(this.prisma);
  }

  // Command Handlers
  public getCreateCreditLineHandler() {
    return new CreateCreditLineCommandHandler(
      this.getLigneDeCreditRepository(),
      this.getBanqueRepository()
    );
  }

  // Query Handlers
  public getListCreditLinesHandler() {
    return new ListCreditLinesQueryHandler(this.getLigneDeCreditRepository());
  }

  public getCalculateDisponibiliteHandler() {
    return new CalculateDisponibiliteQueryHandler(
      this.getLigneDeCreditRepository(),
      this.getEngagementRepository()
    );
  }

  public getGetCreditLineByIdHandler() {
    return new GetCreditLineByIdQueryHandler(this.getLigneDeCreditRepository());
  }

  // Command Handlers
  public getDeleteCreditLineHandler() {
    return new DeleteCreditLineCommandHandler(this.getLigneDeCreditRepository());
  }

  public getUpdateCreditLineHandler() {
    return new UpdateCreditLineCommandHandler(this.getLigneDeCreditRepository());
  }

  // Guarantees
  public getListGuaranteesHandler() {
    const { ListGuaranteesQueryHandler } = require('../../application/queries/ListGuaranteesQuery');
    return new ListGuaranteesQueryHandler(this.getLigneDeCreditRepository());
  }

  public getGuaranteesController() {
    const { GuaranteesController } = require('../../interfaces/http/controllers/GuaranteesController');
    // GuaranteesController expects IQueryBus. 
    // For simplicity given the pattern here, we might need a simple Bus adapter or pass the handler directly.
    // The existing CreditLineController takes handlers directly. 
    // My GuaranteesController usage `this.queryBus.execute` implies it expects a bus. 
    // To match the project pattern I should probably change GuaranteesController to accept the handler directly 
    // OR create a simple wrapper.
    // Let's modify GuaranteesController to take the handler directly like CreditLineController likely does.
    // Wait, let's verify CreditLineController signature.
    // It takes 6 arguments, all handlers. 
    // So I should refactor GuaranteesController to take ListGuaranteesQueryHandler.

    return new GuaranteesController(this.getListGuaranteesHandler());
  }

  // Controller
  public getCreditLineController() {
    return new CreditLineController(
      this.getCreateCreditLineHandler(),
      this.getListCreditLinesHandler(),
      this.getCalculateDisponibiliteHandler(),
      this.getGetCreditLineByIdHandler(),
      this.getDeleteCreditLineHandler(),
      this.getUpdateCreditLineHandler()
    );
  }
}
