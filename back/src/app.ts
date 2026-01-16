import express, { Application } from 'express';
import { container as identityContainer } from './identity/infrastructure/config/DIContainer';
import { CreditLineDIContainer } from './credit-line/infrastructure/config/DIContainer';
import { SwiftDIContainer } from './bank-swift/infrastructure/config/DIContainer';
import { CompanyDIContainer } from './company/infrastructure/config/DIContainer';
import { createAuthRoutes } from './identity/infrastructure/express/routes/auth.routes';
import { createUserRoutes } from './identity/infrastructure/express/routes/user.routes';
import { createRbacRoutes } from './identity/infrastructure/express/routes/rbac.routes';
import { createCreditLineRoutes } from './credit-line/infrastructure/routes/creditLine.routes';
import { createSwiftRoutes } from './bank-swift/infrastructure/routes/swift.routes';
import { createCompanyRoutes } from './company/infrastructure/routes/company.routes';
import { createBusinessUnitRoutes } from './company/infrastructure/routes/businessUnit.routes';
import { createSupplierRoutes } from './company/infrastructure/routes/supplier.routes';
import { createAuditRoutes } from './system/infrastructure/express/routes/audit.routes';
import workflowRoutes from './workflow/infrastructure/api/workflow.routes';
import { ErrorHandlerMiddleware } from './identity/infrastructure/express/middleware/ErrorHandlerMiddleware';
import { errorHandler, logger } from './shared/infrastructure/middleware/error.middleware';
import { setupSwagger } from './shared/infrastructure/swagger/swagger.setup';
import { asyncContextMiddleware } from './shared/infrastructure/middleware/AsyncContextMiddleware';


/**
 * Main Application Class
 * Integrates all modules: Identity, Credit Line, and SWIFT
 */
export class App {
  private app: Application;
  private port: number;

  constructor(port: number = 9000) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Async Context - Must be before other middleware
    this.app.use(asyncContextMiddleware);

    // CORS configuration
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }

      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      logger.info({
        method: req.method,
        url: req.url,
        body: req.body,
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'api-standard',
        modules: ['identity', 'credit-line', 'swift', 'company'],
      });
    });

    // Setup Swagger documentation (should be before 404 handler)
    // if (process.env.NODE_ENV !== 'production') {
    setupSwagger(this.app);
    // }

    // Identity Module Routes
    const authController = identityContainer.getAuthenticationController();
    const userController = identityContainer.getUserController();
    const authMiddleware = identityContainer.getAuthenticationMiddleware();
    const permissionMiddleware = identityContainer.getPermissionMiddleware();
    const roleController = identityContainer.getRoleController();
    const permissionController = identityContainer.getPermissionController();
    const userRoleController = identityContainer.getUserRoleController();

    this.app.use('/api/v1/auth', createAuthRoutes(authController, authMiddleware));
    this.app.use('/api/v1/users', createUserRoutes(userController, authMiddleware, permissionMiddleware));
    this.app.use('/api/v1/rbac', createRbacRoutes(roleController, permissionController, userRoleController, authMiddleware, permissionMiddleware));

    // System Module Routes
    const auditLogController = identityContainer.getAuditLogController();
    this.app.use('/api/v1/system/audit-logs', createAuditRoutes(auditLogController, authMiddleware, permissionMiddleware));

    // Workflow Template Engine Routes
    this.app.use('/api/v1/workflows', workflowRoutes);

    // Credit Line Module Routes
    const creditLineContainer = CreditLineDIContainer.getInstance();
    const creditLineController = creditLineContainer.getCreditLineController();
    this.app.use('/api/v1/credit-lines', createCreditLineRoutes(creditLineController, authMiddleware));

    // Guarantees Route (Consolidated in CreditLine module or separate)
    // Using simple router exported from guarantees.routes.ts
    // We didn't wrap it in a factory function like createCreditLineRoutes, just exported 'guaranteesRouter'
    const { guaranteesRouter } = require('./credit-line/interfaces/http/routes/guarantees.routes');
    this.app.use('/api/v1/guarantees', guaranteesRouter);

    // SWIFT Module Routes
    const swiftContainer = SwiftDIContainer.getInstance();
    const swiftController = swiftContainer.getSwiftController();
    const banqueController = swiftContainer.getBanqueController();
    this.app.use('/api/v1/swift', createSwiftRoutes(swiftController, banqueController, authMiddleware));

    // Company Module Routes
    const companyContainer = CompanyDIContainer.getInstance();
    const companyController = companyContainer.getCompanyController();
    const businessUnitController = companyContainer.getBusinessUnitController();
    const supplierController = companyContainer.getSupplierController();
    this.app.use('/api/v1/companies', createCompanyRoutes(companyController, authMiddleware));
    this.app.use('/api/v1/business-units', createBusinessUnitRoutes(businessUnitController, authMiddleware));
    this.app.use('/api/v1/suppliers', createSupplierRoutes(supplierController, authMiddleware));

    // 404 handler - must be after all routes
    this.app.all('*', (req, res) => {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Cannot ${req.method} ${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // Use the comprehensive error handler from Identity module
    this.app.use(ErrorHandlerMiddleware.handle);
    // Fallback to shared error handler
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
      await this.cleanup();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 SIGINT received. Shutting down gracefully...');
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup(): Promise<void> {
    try {
      await identityContainer.cleanup();
      logger.info('✅ Cleanup completed successfully');
    } catch (error) {
      logger.error({ error }, '❌ Error during cleanup');
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// Export a function to create the app instance
export function createApp(port?: number): App {
  return new App(port);
}

// Start server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || '9000', 10);
  const app = new App(port);
  app.start();
}
