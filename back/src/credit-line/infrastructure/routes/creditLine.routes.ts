import { Router } from 'express';
import { CreditLineController } from '../controllers/CreditLineController';
import { validateRequest } from '../../../shared/infrastructure/middleware/validation.middleware';
import { CreateLigneDeCreditSchema } from '../../../shared/infrastructure/validation/schemas';
import { AuthenticationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';

export const createCreditLineRoutes = (controller: CreditLineController, authMiddleware: AuthenticationMiddleware): Router => {
  const router = Router();
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  /**
   * @swagger
   * /credit-lines:
   *   post:
   *     tags: [Credit Lines]
   *     summary: Create a new credit line
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateLigneDeCredit'
   *     responses:
   *       201:
   *         description: Credit line created successfully
   *       400:
   *         description: Bad request
   */
  router.post('/', validateRequest(CreateLigneDeCreditSchema), controller.create.bind(controller));

  /**
   * @swagger
   * /credit-lines:
   *   get:
   *     tags: [Credit Lines]
   *     summary: List all credit lines
   *     description: Optionally filter by banqueId
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: banqueId
   *         schema:
   *           type: string
   *         description: Filter by Bank ID
   *     responses:
   *       200:
   *         description: List of credit lines retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', controller.list.bind(controller));

  /**
   * @swagger
   * /credit-lines/{id}/disponibilite:
   *   get:
   *     tags: [Credit Lines]
   *     summary: Calculate disponibilité for a credit line
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Credit Line ID
   *     responses:
   *       200:
   *         description: Disponibilité calculated successfully
   *       404:
   *         description: Credit line not found
   */
  router.get('/:id/disponibilite', controller.getDisponibilite.bind(controller));

  /**
   * @swagger
   * /credit-lines/{id}:
   *   get:
   *     tags: [Credit Lines]
   *     summary: Get credit line by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Credit Line ID
   *     responses:
   *       200:
   *         description: Credit line details retrieved successfully
   *       404:
   *         description: Credit line not found
   */
  router.get('/:id', controller.getById.bind(controller));

  /**
   * @swagger
   * /credit-lines/{id}:
   *   delete:
   *     tags: [Credit Lines]
   *     summary: Delete credit line by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Credit Line ID
   *     responses:
   *       200:
   *         description: Credit line deleted successfully
   *       400:
   *         description: Validation error (e.g. has related engagements)
   *       404:
   *         description: Credit line not found
   */
  /**
   * @swagger
   * /credit-lines/{id}:
   *   put:
   *     tags: [Credit Lines]
   *     summary: Update credit line by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateLigneDeCredit'
   *     responses:
   *       200:
   *         description: Credit line updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Credit line not found
   */
  router.put('/:id', controller.update.bind(controller));

  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
