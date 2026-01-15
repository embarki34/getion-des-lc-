import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { AuthenticationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';

export const createCompanyRoutes = (companyController: CompanyController, authMiddleware: AuthenticationMiddleware): Router => {
  const router = Router();
  router.use(authMiddleware.authenticate.bind(authMiddleware));

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
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               taxId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Company created successfully
   *       400:
   *         description: Bad request
   */
  router.post('/', companyController.create.bind(companyController));

  /**
   * @swagger
   * /companies:
   *   get:
   *     tags: [Companies]
   *     summary: Get all companies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of companies retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', companyController.getAll.bind(companyController));

  /**
   * @swagger
   * /companies/{id}:
   *   get:
   *     tags: [Companies]
   *     summary: Get company by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Company ID
   *     responses:
   *       200:
   *         description: Company details retrieved successfully
   *       404:
   *         description: Company not found
   */
  router.get('/:id', companyController.getById.bind(companyController));

  /**
   * @swagger
   * /companies/{id}:
   *   put:
   *     tags: [Companies]
   *     summary: Update company
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Company ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               taxId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Company updated successfully
   *       404:
   *         description: Company not found
   */
  router.put('/:id', companyController.update.bind(companyController));

  /**
   * @swagger
   * /companies/{id}:
   *   delete:
   *     tags: [Companies]
   *     summary: Delete company
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Company ID
   *     responses:
   *       200:
   *         description: Company deleted successfully
   *       404:
   *         description: Company not found
   */
  router.delete('/:id', companyController.delete.bind(companyController));

  return router;
};

