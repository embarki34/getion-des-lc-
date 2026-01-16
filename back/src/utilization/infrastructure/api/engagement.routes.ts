import { Router } from 'express';
import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { EngagementService } from '../../application/EngagementService';
import { EngagementController } from './EngagementController';

const router = Router();
const prisma = new PrismaClient();
const service = new EngagementService(prisma);
const controller = new EngagementController(service);

// Engagement Routes
router.get('/', controller.listEngagements);
router.get('/:id', controller.getEngagement);
router.post('/', controller.createEngagement);
router.put('/:id', controller.updateEngagement);
router.delete('/:id', controller.deleteEngagement);

// Step completion history
router.get('/:id/step-completions', controller.getStepCompletions);

// Complete engagement history with audit trail
router.get('/:id/history', controller.getEngagementHistory);

// Workflow transition
router.post('/:id/next-step', controller.moveToNextStep);

export default router;
