import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { swaggerSpec } from './swagger.config';

export function setupSwagger(app: Application): void {
  // Serve Swagger UI at /api-docs
  // Using type assertion to resolve Express type conflicts between dependencies
  app.use('/api-docs', ...(swaggerUi.serve as any));
  app.get(
    '/api-docs',
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Gestion LC API Documentation',
    }) as any
  );

  // Serve raw swagger.json at /api-docs.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger documentation available at http://localhost:9000/api-docs`);
}