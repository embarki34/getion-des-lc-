import { Router } from 'express';
import { BusinessUnitController } from '../controllers/BusinessUnitController';
import { AuthenticationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';

export const createBusinessUnitRoutes = (controller: BusinessUnitController, authMiddleware: AuthenticationMiddleware): Router => {
  const router = Router();
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  /**
   * @swagger
   * /business-units:
   *   post:
   *     tags: [Business Units]
   *     summary: Create a new business unit
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
   *               code:
   *                 type: string
   *     responses:
   *       201:
   *         description: Business unit created successfully
   *       400:
   *         description: Bad request
   */
  router.post('/', controller.create.bind(controller));

  /**
   * @swagger
   * /business-units:
   *   get:
   *     tags: [Business Units]
   *     summary: Get all business units
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of business units retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', controller.getAll.bind(controller));

  /**
   * @swagger
   * /business-units/{id}:
   *   get:
   *     tags: [Business Units]
   *     summary: Get business unit by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Business unit ID
   *     responses:
   *       200:
   *         description: Business unit details retrieved successfully
   *       404:
   *         description: Business unit not found
   */
  router.get('/:id', controller.getById.bind(controller));

  /**
   * @swagger
   * /business-units/{id}:
   *   put:
   *     tags: [Business Units]
   *     summary: Update business unit
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Business unit ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               code:
   *                 type: string
   *     responses:
   *       200:
   *         description: Business unit updated successfully
   *       404:
   *         description: Business unit not found
   */
  router.put('/:id', controller.update.bind(controller));

  /**
   * @swagger
   * /business-units/{id}:
   *   delete:
   *     tags: [Business Units]
   *     summary: Delete business unit
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Business unit ID
   *     responses:
   *       200:
   *         description: Business unit deleted successfully
   *       404:
   *         description: Business unit not found
   */
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};

