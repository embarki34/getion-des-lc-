import express, { Application } from "express";
import { container } from "../config/DIContainer";
import { createAuthRoutes } from "./routes/auth.routes";
import { createUserRoutes } from "./routes/user.routes";
import { createRbacRoutes } from "./routes/rbac.routes";
import { ErrorHandlerMiddleware } from "./middleware/ErrorHandlerMiddleware";

/**
 * Creates and configures Express application
 */
export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS (configure as needed)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "identity-api",
    });
  });

  // API Routes
  const authController = container.getAuthenticationController();
  const userController = container.getUserController();
  const authMiddleware = container.getAuthenticationMiddleware();
  const permissionMiddleware = container.getPermissionMiddleware();
  const roleController = container.getRoleController();
  const permissionController = container.getPermissionController();
  const userRoleController = container.getUserRoleController();

  app.use("/api/v1/auth", createAuthRoutes(authController, authMiddleware));
  app.use("/api/v1/users", createUserRoutes(userController, authMiddleware, permissionMiddleware));
  app.use("/api/v1/rbac", createRbacRoutes(roleController, permissionController, userRoleController, authMiddleware, permissionMiddleware));

  // 404 handler
  app.all("*", (req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Global error handler (must be last)
  app.use(ErrorHandlerMiddleware.handle);

  return app;
}

/**
 * Start the server
 */
export async function startServer(): Promise<void> {
  const app = createApp();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log(`🚀 Identity API Server`);
    console.log("=".repeat(50));
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log("=".repeat(50));
    console.log("\n📚 Available Endpoints:");
    console.log("  POST   /api/v1/auth/register");
    console.log("  POST   /api/v1/auth/login");
    console.log("  POST   /api/v1/auth/refresh");
    console.log("  POST   /api/v1/auth/logout");
    console.log("  GET    /api/v1/users/me");
    console.log("  PUT    /api/v1/users/me/password");
    console.log("  GET    /api/v1/users/:id (Admin)");
    console.log("=".repeat(50));
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("\n🛑 SIGTERM received. Shutting down gracefully...");
    await container.cleanup();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("\n🛑 SIGINT received. Shutting down gracefully...");
    await container.cleanup();
    process.exit(0);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
}
