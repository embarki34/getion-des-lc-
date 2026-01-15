import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { createAuditMiddleware } from '../../../shared/infrastructure/persistence/prisma/AuditMiddleware';

// Repositories
import { PrismaSwiftMessageRepository } from '../repositories/PrismaSwiftMessageRepository';
import { PrismaBanqueRepository } from '../repositories/PrismaBanqueRepository';

// Services
import { SwiftMT700Generator } from '../swift/SwiftMT700Generator';

// Command Handlers
import { GenerateSwiftMT700CommandHandler } from '../../application/commands/GenerateSwiftMT700Command';
import { CreateBanqueCommandHandler } from '../../application/commands/CreateBanqueCommand';
import { UpdateBanqueCommandHandler } from '../../application/commands/UpdateBanqueCommand';
import { DeleteBanqueCommandHandler } from '../../application/commands/DeleteBanqueCommand';
import { AddBankAccountCommandHandler } from '../../application/commands/AddBankAccountCommand';
import { UpdateBankAccountCommandHandler } from '../../application/commands/UpdateBankAccountCommand';
import { DeleteBankAccountCommandHandler as DeleteAccountHandler } from '../../application/commands/DeleteBankAccountCommand';

// Query Handlers
import { GetSwiftMessagesQueryHandler } from '../../application/queries/GetSwiftMessagesQuery';
import { GetSwiftMessageByIdQueryHandler } from '../../application/queries/GetSwiftMessageByIdQuery';
import { GetAllBanquesQueryHandler } from '../../application/queries/GetAllBanquesQuery';
import { GetBanqueByIdQueryHandler } from '../../application/queries/GetBanqueByIdQuery';

// Controllers
import { SwiftController } from '../controllers/SwiftController';
import { BanqueController } from '../controllers/BanqueController';

export class SwiftDIContainer {
  private static instance: SwiftDIContainer;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(createAuditMiddleware(this.prisma));
  }

  public static getInstance(): SwiftDIContainer {
    if (!SwiftDIContainer.instance) {
      SwiftDIContainer.instance = new SwiftDIContainer();
    }
    return SwiftDIContainer.instance;
  }

  // Repositories
  public getSwiftMessageRepository() {
    return new PrismaSwiftMessageRepository(this.prisma);
  }

  public getBanqueRepository() {
    return new PrismaBanqueRepository(this.prisma);
  }

  // Services
  public getSwiftMT700Generator() {
    return new SwiftMT700Generator();
  }

  // Command Handlers
  public getGenerateSwiftMT700Handler() {
    return new GenerateSwiftMT700CommandHandler(
      this.getSwiftMessageRepository(),
      this.getSwiftMT700Generator()
    );
  }

  public getCreateBanqueHandler() {
    return new CreateBanqueCommandHandler(this.getBanqueRepository());
  }

  public getUpdateBanqueHandler() {
    return new UpdateBanqueCommandHandler(this.getBanqueRepository());
  }

  public getDeleteBanqueHandler() {
    return new DeleteBanqueCommandHandler(this.getBanqueRepository());
  }

  // Query Handlers
  public getGetSwiftMessagesHandler() {
    return new GetSwiftMessagesQueryHandler(this.getSwiftMessageRepository());
  }

  public getGetSwiftMessageByIdHandler() {
    return new GetSwiftMessageByIdQueryHandler(this.getSwiftMessageRepository());
  }

  public getGetAllBanquesHandler() {
    return new GetAllBanquesQueryHandler(this.getBanqueRepository());
  }

  public getGetBanqueByIdHandler() {
    return new GetBanqueByIdQueryHandler(this.getBanqueRepository());
  }

  // Controllers
  public getSwiftController() {
    return new SwiftController(
      this.getGenerateSwiftMT700Handler(),
      this.getGetSwiftMessagesHandler(),
      this.getGetSwiftMessageByIdHandler()
    );
  }

  public getBanqueController() {
    return new BanqueController(
      this.getCreateBanqueHandler(),
      this.getUpdateBanqueHandler(),
      this.getDeleteBanqueHandler(),
      this.getGetAllBanquesHandler(),
      this.getGetBanqueByIdHandler(),
      this.getAddBankAccountHandler(),
      this.getUpdateBankAccountHandler(),
      this.getDeleteBankAccountHandler()
    );
  }

  public getAddBankAccountHandler() {
    return new AddBankAccountCommandHandler(this.getBanqueRepository());
  }

  public getUpdateBankAccountHandler() {
    return new UpdateBankAccountCommandHandler(this.getBanqueRepository());
  }

  public getDeleteBankAccountHandler() {
    return new DeleteAccountHandler(this.getBanqueRepository());
  }
}
