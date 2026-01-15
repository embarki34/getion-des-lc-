import { Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController";
import { AuthenticationMiddleware } from "../middleware/AuthenticationMiddleware";
import { asyncHandler } from "../../../../shared/infrastructure/utils/asyncHandler";

/**
 * Creates authentication routes
 */
export function createAuthRoutes(
  authController: AuthenticationController,
  authMiddleware: AuthenticationMiddleware
): Router {
  const router = Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   */
  router.post("/register", asyncHandler(authController.register));

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: Login user and get tokens
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  router.post("/login", asyncHandler(authController.login));

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     tags: [Authentication]
   *     summary: Refresh access token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       401:
   *         description: Invalid refresh token
   */
  router.post("/refresh", asyncHandler(authController.refresh));

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     tags: [Authentication]
   *     summary: Logout user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized
   */
  router.post("/logout", authMiddleware.authenticate as any, asyncHandler(authController.logout));

  return router;
}
