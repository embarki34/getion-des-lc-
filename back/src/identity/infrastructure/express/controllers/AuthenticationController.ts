import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/AuthenticationMiddleware";
import { RegisterUserUseCase } from "../../../application/use-cases/authentication/RegisterUserUseCase";
import { LoginUserUseCase } from "../../../application/use-cases/authentication/LoginUserUseCase";
import { RefreshTokenUseCase } from "../../../application/use-cases/authentication/RefreshTokenUseCase";
import {
  RegisterUserRequest,
  LoginRequest,
  RefreshTokenRequest,
} from "../../../application/dtos/Requests";

/**
 * Authentication controller
 * Handles authentication-related HTTP requests
 */
export class AuthenticationController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) { }

  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, role, status, password } = req.body;

    // Validate request body
    if (!name || !email || !phone || !role || !status || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Name, email, phone, role, status, and password are required",
        },
      });
      return;
    }

    // Create request DTO
    const request = new RegisterUserRequest(
      name,
      email,
      phone,
      password,
      role,
      status
    );

    // Execute use case
    const result = await this.registerUserUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      throw error;
    }

    const user = result.getValue();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
      },
      message: "User registered successfully. Please verify your email.",
    });
  };

  /**
   * POST /api/v1/auth/login
   * Login user and return tokens
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
      });
      return;
    }

    // Create request DTO
    const request = new LoginRequest(email, password);

    // Execute use case
    const result = await this.loginUserUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      throw error;
    }

    const authResponse = result.getValue();

    res.status(200).json({
      success: true,
      data: {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        expiresIn: authResponse.expiresIn,
        user: {
          id: authResponse.user.id,
          name: authResponse.user.name,
          email: authResponse.user.email,
          role: authResponse.user.role,
          emailVerified: authResponse.user.emailVerified,
          lastLoginAt: authResponse.user.lastLoginAt,
        },
      },
      message: "Login successful",
    });
  };

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token using refresh token
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    // Validate request body
    if (!refreshToken) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Refresh token is required",
        },
      });
      return;
    }

    // Create request DTO
    const request = new RefreshTokenRequest(refreshToken);

    // Execute use case
    const result = await this.refreshTokenUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      throw error;
    }

    const tokenResponse = result.getValue();

    res.status(200).json({
      success: true,
      data: {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresIn: tokenResponse.expiresIn,
      },
      message: "Token refreshed successfully",
    });
  };

  /**
   * POST /api/v1/auth/logout
   * Logout user (client should discard tokens)
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    // In a stateless JWT implementation, logout is handled client-side
    // For a stateful implementation, you would invalidate the refresh token here

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  };
}
