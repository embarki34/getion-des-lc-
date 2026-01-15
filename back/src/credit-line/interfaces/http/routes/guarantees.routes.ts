import { Router } from 'express';
import { CreditLineDIContainer } from '../../../infrastructure/config/DIContainer';

const router = Router();
const container = CreditLineDIContainer.getInstance();
const controller = container.getGuaranteesController();

router.get('/', (req, res) => controller.list(req, res));

export const guaranteesRouter = router;
