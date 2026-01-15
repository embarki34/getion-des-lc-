# Swagger/OpenAPI Documentation Setup

## Installation

To add Swagger documentation to this project, install the following packages:

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

Or using yarn:

```bash
yarn add swagger-ui-express swagger-jsdoc
yarn add -D @types/swagger-ui-express @types/swagger-jsdoc
```

## Configuration

### 1. Create Swagger Configuration File

Create `src/shared/infrastructure/swagger/swagger.config.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Gestion LC API',
    version: '1.0.0',
    description: 'Multi-company credit line management system with RBAC',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Companies',
      description: 'Company management endpoints',
    },
    {
      name: 'Business Units',
      description: 'Business unit management endpoints',
    },
    {
      name: 'Suppliers',
      description: 'Supplier management endpoints',
    },
    {
      name: 'Credit Lines',
      description: 'Credit line management endpoints',
    },
    {
      name: 'SWIFT',
      description: 'SWIFT message management endpoints',
    },
    {
      name: 'RBAC',
      description: 'Role-Based Access Control endpoints',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./src/**/*.routes.ts', './src/**/*.controller.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 2. Create Swagger Setup File

Create `src/shared/infrastructure/swagger/swagger.setup.ts`:

```typescript
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { swaggerSpec } from './swagger.config';

export function setupSwagger(app: Application): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Gestion LC API Documentation',
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at http://localhost:3000/api-docs');
}
```

### 3. Integrate into Main App

Update `src/app.ts`:

```typescript
import { setupSwagger } from './shared/infrastructure/swagger/swagger.setup';

export class App {
  // ... existing code ...

  private setupRoutes(): void {
    // ... existing routes ...

    // Setup Swagger documentation (should be before 404 handler)
    if (process.env.NODE_ENV !== 'production') {
      setupSwagger(this.app);
    }

    // 404 handler - must be after all routes
    // ...
  }
}
```

## Example Route Documentation

Here's an example of how to document routes using JSDoc comments:

```typescript
/**
 * @swagger
 * /companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a new company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Main Company SARL"
 *               code:
 *                 type: string
 *                 example: "MAIN"
 *               description:
 *                 type: string
 *                 example: "Main company description"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Algiers"
 *               contactInfo:
 *                 type: string
 *                 example: "contact@main.com"
 *               parentCompanyId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 message:
 *                   type: string
 *                   example: "Company created successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', controller.create.bind(controller));
```

## Accessing Swagger UI

Once set up, you can access the Swagger documentation at:

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

## Notes

- Swagger documentation is typically disabled in production for security reasons
- All endpoints should be documented with proper request/response schemas
- Use security schemes for protected endpoints (JWT Bearer tokens)
- Group related endpoints using tags
- Include examples in the documentation

## Alternative: Using tsoa (TypeScript OpenAPI)

For a more type-safe approach, consider using `tsoa` which generates OpenAPI specs directly from TypeScript decorators:

```bash
npm install tsoa
npm install --save-dev @types/tsoa
```

This requires additional configuration but provides better type safety and automatic documentation generation.

