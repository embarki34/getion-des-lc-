import { Router } from 'express';
import { SwiftController } from '../controllers/SwiftController';
import { BanqueController } from '../controllers/BanqueController';
import { validateRequest } from '../../../shared/infrastructure/middleware/validation.middleware';
import {
  GenerateSwiftMT700Schema,
  CreateBanqueSchema,
  UpdateBanqueSchema,
} from '../../../shared/infrastructure/validation/schemas';
import { AuthenticationMiddleware } from '../../../identity/infrastructure/express/middleware/AuthenticationMiddleware';

export const createSwiftRoutes = (
  swiftController: SwiftController,
  banqueController: BanqueController,
  authMiddleware: AuthenticationMiddleware
): Router => {
  const router = Router();
  router.use(authMiddleware.authenticate.bind(authMiddleware));

  // --- SWIFT Messages Routes ---

  /**
   * @swagger
   * /swift/mt700:
   *   post:
   *     tags: [SWIFT]
   *     summary: Generate SWIFT MT700 message
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/GenerateSwiftMT700'
   *     responses:
   *       201:
   *         description: SWIFT MT700 message generated successfully
   *       400:
   *         description: Bad request
   */
  router.post(
    '/mt700',
    validateRequest(GenerateSwiftMT700Schema),
    swiftController.generateMT700.bind(swiftController)
  );

  /**
   * @swagger
   * /swift:
   *   get:
   *     tags: [SWIFT]
   *     summary: Get all SWIFT messages
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of SWIFT messages retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', swiftController.getAll.bind(swiftController));

  // --- Bank Routes ---
  // NOTE: Bank routes MUST come before /swift/:id to avoid route matching conflicts
  // Express matches routes in order, so /swift/banks would match /swift/:id if placed after

  /**
   * @swagger
   * /swift/banks:
   *   post:
   *     tags: [Banks]
   *     summary: Create a new bank
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBanque'
   *     responses:
   *       201:
   *         description: Bank created successfully
   *       400:
   *         description: Bad request
   */
  router.post(
    '/banks',
    validateRequest(CreateBanqueSchema),
    banqueController.create.bind(banqueController)
  );

  /**
   * @swagger
   * /swift/banks:
   *   get:
   *     tags: [Banks]
   *     summary: Get all banks
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of banks retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/banks', banqueController.getAll.bind(banqueController));

  /**
   * @swagger
   * /swift/banks/{id}:
   *   get:
   *     tags: [Banks]
   *     summary: Get bank by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *     responses:
   *       200:
   *         description: Bank details retrieved successfully
   *       404:
   *         description: Bank not found
   */
  router.get('/banks/:id', banqueController.getById.bind(banqueController));

  /**
   * @swagger
   * /swift/banks/{id}/accounts:
   *   post:
   *     tags: [Banks]
   *     summary: Add account to bank
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBankAccount'
   *     responses:
   *       201:
   *         description: Bank account added successfully
   *       404:
   *         description: Bank not found
   */
  router.post(
    '/banks/:id/accounts',
    // validateRequest(CreateBankAccountSchema), // TODO: Add schema
    banqueController.addAccount.bind(banqueController)
  );

  /**
   * @swagger
   * /swift/banks/{id}/accounts/{accountId}:
   *   put:
   *     tags: [Banks]
   *     summary: Update bank account
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *       - in: path
   *         name: accountId
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank Account ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateBankAccount'
   *     responses:
   *       200:
   *         description: Bank account updated successfully
   *       404:
   *         description: Bank account not found
   */
  router.put(
    '/banks/:id/accounts/:accountId',
    banqueController.updateAccount.bind(banqueController)
  );

  /**
   * @swagger
   * /swift/banks/{id}/accounts/{accountId}:
   *   delete:
   *     tags: [Banks]
   *     summary: Delete bank account
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *       - in: path
   *         name: accountId
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank Account ID
   *     responses:
   *       200:
   *         description: Bank account deleted successfully
   *       404:
   *         description: Bank account not found
   */
  router.delete(
    '/banks/:id/accounts/:accountId',
    banqueController.deleteAccount.bind(banqueController)
  );

  /**
   * @swagger
   * /swift/banks/{id}:
   *   put:
   *     tags: [Banks]
   *     summary: Update bank
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateBanque'
   *     responses:
   *       200:
   *         description: Bank updated successfully
   *       404:
   *         description: Bank not found
   */
  router.put(
    '/banks/:id',
    validateRequest(UpdateBanqueSchema),
    banqueController.update.bind(banqueController)
  );

  /**
   * @swagger
   * /swift/banks/{id}:
   *   delete:
   *     tags: [Banks]
   *     summary: Delete bank
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Bank ID
   *     responses:
   *       200:
   *         description: Bank deleted successfully
   *       404:
   *         description: Bank not found
   */
  router.delete('/banks/:id', banqueController.delete.bind(banqueController));

  /**
   * @swagger
   * /swift/{id}:
   *   get:
   *     tags: [SWIFT]
   *     summary: Get SWIFT message by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: SWIFT message ID
   *     responses:
   *       200:
   *         description: SWIFT message details retrieved successfully
   *       404:
   *         description: SWIFT message not found
   */
  router.get('/:id', swiftController.getById.bind(swiftController));

  return router;
};
