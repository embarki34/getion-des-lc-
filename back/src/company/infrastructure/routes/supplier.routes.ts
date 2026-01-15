import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { AuthenticationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';

export const createSupplierRoutes = (controller: SupplierController, authMiddleware: AuthenticationMiddleware): Router => {
  const router = Router();
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  /**
   * @swagger
   * /suppliers:
   *   post:
   *     tags: [Suppliers]
   *     summary: Create a new supplier
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
   *               address:
   *                 type: string
   *     responses:
   *       201:
   *         description: Supplier created successfully
   *       400:
   *         description: Bad request
   */
  router.post('/', controller.create.bind(controller));

  /**
   * @swagger
   * /suppliers:
   *   get:
   *     tags: [Suppliers]
   *     summary: Get all suppliers
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of suppliers retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', controller.getAll.bind(controller));

  /**
   * @swagger
   * /suppliers/{id}:
   *   get:
   *     tags: [Suppliers]
   *     summary: Get supplier by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Supplier ID
   *     responses:
   *       200:
   *         description: Supplier details retrieved successfully
   *       404:
   *         description: Supplier not found
   */
  router.get('/:id', controller.getById.bind(controller));

  /**
   * @swagger
   * /suppliers/{id}:
   *   put:
   *     tags: [Suppliers]
   *     summary: Update supplier
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Supplier ID
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
   *               address:
   *                 type: string
   *     responses:
   *       200:
   *         description: Supplier updated successfully
   *       404:
   *         description: Supplier not found
   */
  router.put('/:id', controller.update.bind(controller));

  /**
   * @swagger
   * /suppliers/{id}:
   *   delete:
   *     tags: [Suppliers]
   *     summary: Delete supplier
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Supplier ID
   *     responses:
   *       200:
   *         description: Supplier deleted successfully
   *       404:
   *         description: Supplier not found
   */
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};

