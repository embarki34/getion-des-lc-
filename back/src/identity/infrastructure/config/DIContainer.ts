import { PrismaClient } from '../persistence/prisma/client';
import { PrismaUserRepository } from '../persistence/repositories/PrismaUserRepository';
import { BcryptPasswordHashingService } from '../services/BcryptPasswordHashingService';
import { JwtTokenService } from '../services/JwtTokenService';
import { ConsoleEmailService } from '../services/ConsoleEmailService';
import { InMemoryEventPublisher } from '../services/InMemoryEventPublisher';
import { RegisterUserUseCase } from '../../application/use-cases/authentication/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/authentication/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/authentication/RefreshTokenUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/user-management/GetUserProfileUseCase';
import { ChangePasswordUseCase } from '../../application/use-cases/user-management/ChangePasswordUseCase';
import { AuthenticationController } from '../express/controllers/AuthenticationController';
import { UserController } from '../express/controllers/UserController';
import { RoleController } from '../express/controllers/RoleController';
import { PermissionController } from '../express/controllers/PermissionController';
import { UserRoleController } from '../express/controllers/UserRoleController';
import { AuthenticationMiddleware } from '../express/middleware/AuthenticationMiddleware';
import { PrismaRoleRepository } from '../persistence/repositories/PrismaRoleRepository';
import { PrismaPermissionRepository } from '../persistence/repositories/PrismaPermissionRepository';
import { PrismaUserRoleRepository } from '../persistence/repositories/PrismaUserRoleRepository';
import { PrismaRolePermissionRepository } from '../persistence/repositories/PrismaRolePermissionRepository';
import { RbacService } from '../services/RbacService';
import { ConflictDetectionService } from '../../domain/services/ConflictDetectionService';
import { PermissionMiddleware } from '../express/middleware/PermissionMiddleware';
import { CreateRoleCommandHandler } from '../../application/rbac/commands/CreateRoleCommand';
import { UpdateRoleCommandHandler } from '../../application/rbac/commands/UpdateRoleCommand';
import { DeleteRoleCommandHandler } from '../../application/rbac/commands/DeleteRoleCommand';
import { AssignRoleToUserCommandHandler } from '../../application/rbac/commands/AssignRoleToUserCommand';
import { GetRoleByIdQueryHandler } from '../../application/rbac/queries/GetRoleByIdQuery';
import { GetAllRolesQueryHandler } from '../../application/rbac/queries/GetAllRolesQuery';
import { GetAllPermissionsQueryHandler } from '../../application/rbac/queries/GetAllPermissionsQuery';
import { GetUserRolesQueryHandler } from '../../application/rbac/queries/GetUserRolesQuery';
import { GetUsersByBusinessUnitUseCase } from '../../application/use-cases/user-management/GetUsersByBusinessUnitUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/user-management/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/user-management/UpdateUserUseCase';
import { ResetUserPasswordUseCase } from '../../application/use-cases/user-management/ResetUserPasswordUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/user-management/DeleteUserUseCase';

import { createAuditMiddleware } from '../../../shared/infrastructure/persistence/prisma/AuditMiddleware';
import { PrismaAuditLogRepository } from '../../../system/infrastructure/persistence/PrismaAuditLogRepository';
import { GetAuditLogsUseCase } from '../../../system/application/use-cases/GetAuditLogsUseCase';
import { AuditLogController } from '../../../system/infrastructure/express/controllers/AuditLogController';

/**
 * Dependency Injection Container
 * Manages all dependencies and their lifecycle
 */
export class DIContainer {
  // Infrastructure
  private prisma!: PrismaClient;
  private userRepository!: PrismaUserRepository;
  private passwordHashingService!: BcryptPasswordHashingService;
  private tokenService!: JwtTokenService;
  private emailService!: ConsoleEmailService;
  private eventPublisher!: InMemoryEventPublisher;

  // RBAC Repositories
  private roleRepository!: PrismaRoleRepository;
  private permissionRepository!: PrismaPermissionRepository;
  private userRoleRepository!: PrismaUserRoleRepository;
  private rolePermissionRepository!: PrismaRolePermissionRepository;

  // RBAC Services
  private rbacService!: RbacService;
  private conflictDetectionService!: ConflictDetectionService;

  // Use Cases
  private registerUserUseCase!: RegisterUserUseCase;
  private loginUserUseCase!: LoginUserUseCase;
  private refreshTokenUseCase!: RefreshTokenUseCase;
  private getUserProfileUseCase!: GetUserProfileUseCase;
  private changePasswordUseCase!: ChangePasswordUseCase;
  private getUsersByBusinessUnitUseCase!: GetUsersByBusinessUnitUseCase;
  private getAllUsersUseCase!: GetAllUsersUseCase;
  private updateUserUseCase!: UpdateUserUseCase;
  private resetUserPasswordUseCase!: ResetUserPasswordUseCase;
  private deleteUserUseCase!: DeleteUserUseCase;

  // Controllers
  private authenticationController!: AuthenticationController;
  private userController!: UserController;
  private roleController!: RoleController;
  private permissionController!: PermissionController;
  private userRoleController!: UserRoleController;
  private auditLogController!: AuditLogController;

  // Middleware

  // Middleware
  private authenticationMiddleware!: AuthenticationMiddleware;
  private permissionMiddleware!: PermissionMiddleware;

  constructor() {
    this.initializeInfrastructure();
    this.initializeUseCases();
    this.initializeAuditFeature(); // Initialize System module
    this.initializeControllers();
    this.initializeMiddleware();
  }

  /**
   * Initialize infrastructure layer dependencies
   */
  private initializeInfrastructure(): void {
    // Database
    this.prisma = new PrismaClient();
    this.prisma.$use(createAuditMiddleware(this.prisma));

    // Repositories
    this.userRepository = new PrismaUserRepository(this.prisma);

    // Services
    this.passwordHashingService = new BcryptPasswordHashingService(
      parseInt(process.env.BCRYPT_ROUNDS || '10')
    );

    this.tokenService = new JwtTokenService({
      accessTokenSecret: process.env.JWT_ACCESS_SECRET || ':%Z.`!TBuL9zNV@aUHWa',
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "b;IWk91jkB2PEXx*m+'d",
      accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
      refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    this.emailService = new ConsoleEmailService();
    this.eventPublisher = new InMemoryEventPublisher();

    // RBAC Repositories
    this.roleRepository = new PrismaRoleRepository(this.prisma);
    this.permissionRepository = new PrismaPermissionRepository(this.prisma);
    this.userRoleRepository = new PrismaUserRoleRepository(this.prisma);
    this.rolePermissionRepository = new PrismaRolePermissionRepository(this.prisma);

    // RBAC Service
    this.rbacService = new RbacService(
      this.userRoleRepository,
      this.rolePermissionRepository,
      this.permissionRepository
    );
    this.conflictDetectionService = new ConflictDetectionService();
  }

  /**
   * Initialize application layer use cases
   */
  private initializeUseCases(): void {
    this.registerUserUseCase = new RegisterUserUseCase(
      this.userRepository,
      this.passwordHashingService,
      this.eventPublisher,
      this.emailService
    );

    this.loginUserUseCase = new LoginUserUseCase(
      this.userRepository,
      this.passwordHashingService,
      this.tokenService,
      this.eventPublisher
    );

    this.refreshTokenUseCase = new RefreshTokenUseCase(this.tokenService);

    this.getUserProfileUseCase = new GetUserProfileUseCase(this.userRepository);

    this.getUsersByBusinessUnitUseCase = new GetUsersByBusinessUnitUseCase(this.userRepository);

    this.changePasswordUseCase = new ChangePasswordUseCase(
      this.userRepository,
      this.passwordHashingService,
      this.eventPublisher,
      this.emailService
    );

    this.getAllUsersUseCase = new GetAllUsersUseCase(this.userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    this.resetUserPasswordUseCase = new ResetUserPasswordUseCase(
      this.userRepository,
      this.passwordHashingService,
      this.eventPublisher,
      this.emailService
    );
    this.deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
  }

  private initializeAuditFeature(): void {
    const auditLogRepository = new PrismaAuditLogRepository(this.prisma);
    const getAuditLogsUseCase = new GetAuditLogsUseCase(auditLogRepository);
    this.auditLogController = new AuditLogController(getAuditLogsUseCase);
  }

  /**
   * Initialize controllers
   */
  private initializeControllers(): void {
    this.authenticationController = new AuthenticationController(
      this.registerUserUseCase,
      this.loginUserUseCase,
      this.refreshTokenUseCase
    );

    this.userController = new UserController(
      this.getUserProfileUseCase,
      this.changePasswordUseCase,
      this.getUsersByBusinessUnitUseCase,
      this.getAllUsersUseCase,
      this.updateUserUseCase,
      this.resetUserPasswordUseCase,
      this.deleteUserUseCase
    );

    // RBAC Controllers
    this.roleController = new RoleController(
      new CreateRoleCommandHandler(this.roleRepository),
      new UpdateRoleCommandHandler(
        this.roleRepository,
        this.permissionRepository
      ),
      new DeleteRoleCommandHandler(this.roleRepository, this.userRoleRepository),
      new GetRoleByIdQueryHandler(this.roleRepository),
      new GetAllRolesQueryHandler(this.roleRepository)
    );

    this.userRoleController = new UserRoleController(
      new AssignRoleToUserCommandHandler(
        this.userRoleRepository,
        this.roleRepository,
        this.userRepository
      ),
      new GetUserRolesQueryHandler(this.userRoleRepository, this.roleRepository),
      this.userRoleRepository
    );

    this.permissionController = new PermissionController(
      new GetAllPermissionsQueryHandler(this.permissionRepository)
    );
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    this.authenticationMiddleware = new AuthenticationMiddleware(this.tokenService);
    this.permissionMiddleware = new PermissionMiddleware(this.rbacService);
  }

  /**
   * Get Prisma client
   */
  getPrisma(): PrismaClient {
    return this.prisma;
  }

  /**
   * Get authentication controller
   */
  getAuthenticationController(): AuthenticationController {
    return this.authenticationController;
  }

  /**
   * Get user controller
   */
  getUserController(): UserController {
    return this.userController;
  }

  /**
   * Get authentication middleware
   */
  getAuthenticationMiddleware(): AuthenticationMiddleware {
    return this.authenticationMiddleware;
  }

  /**
   * Get permission middleware
   */
  getPermissionMiddleware(): PermissionMiddleware {
    return this.permissionMiddleware;
  }

  /**
   * Get conflict detection service
   */
  getConflictDetectionService(): ConflictDetectionService {
    return this.conflictDetectionService;
  }

  /**
   * Get role controller
   */
  getRoleController(): RoleController {
    return this.roleController;
  }

  /**
   * Get user role controller
   */
  getUserRoleController(): UserRoleController {
    return this.userRoleController;
  }

  getPermissionController(): PermissionController {
    return this.permissionController;
  }

  getAuditLogController(): AuditLogController {
    return this.auditLogController;
  }

  /**
   * Get RBAC service
   */
  getRbacService(): RbacService {
    return this.rbacService;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
export const container = new DIContainer();
