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
  apis: [
    './src/**/*.routes.ts',
    './src/**/*.controller.ts',
    './src/shared/infrastructure/swagger/swagger.components.yaml',
  ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
