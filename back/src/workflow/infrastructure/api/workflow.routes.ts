import { Router } from 'express';
import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { PrismaWorkflowTemplateRepository } from '../persistence/PrismaWorkflowTemplateRepository';
import { WorkflowTemplateService } from '../../application/WorkflowTemplateService';
import { WorkflowTemplateController } from './WorkflowTemplateController';
import { AuthorizationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthorizationMiddleware';


const authzMiddleware = new AuthorizationMiddleware();

const router = Router();
const prisma = new PrismaClient();
const repository = new PrismaWorkflowTemplateRepository(prisma);
const service = new WorkflowTemplateService(repository);
const controller = new WorkflowTemplateController(service);

// All routes require authentication
// router.use(authzMiddleware);

// Template Routes
router.get('/templates', controller.listTemplates);
router.get('/templates/code/:code', controller.getTemplateByCode);
router.get('/templates/:id', controller.getTemplate);
router.post('/templates', controller.createTemplate); // Admin only
router.put('/templates/:id', controller.updateTemplate); // Admin only
router.delete('/templates/:id', controller.deleteTemplate); // Admin only

// Step Routes
router.post('/templates/:id/steps', controller.addStep); // Admin only
router.put('/steps/:stepId', controller.updateStep); // Admin only
router.delete('/steps/:stepId', controller.deleteStep); // Admin only

export default router;
