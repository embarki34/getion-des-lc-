import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload, TokenPair } from '../../application/ports/ITokenService';
import { AuthenticationError } from '../../../shared/errors/ConcreteErrors';
import { ErrorCodes } from '../../../shared/errors/ErrorCodes';

/**
 * Configuration for JWT service
 */
export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

/**
 * JWT implementation of token service
 */
export class JwtTokenService implements ITokenService {
  constructor(private readonly config: JwtConfig) {}

  /**
   * Generates an access token
   */
  /**
   * Generates an access token
   */
  generateAccessToken(payload: TokenPayload): string {
    try {
      const secret = this.config.accessTokenSecret;

      if (!secret) {
        throw new AuthenticationError(
          'Access token secret is not configured',
          ErrorCodes.GENERATE_TOKEN_FAILED
        );
      }

      // Sanitize payload to remove existing JWT claims
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, nbf, jti, ...cleanPayload } = payload as any;
      // @ts-ignore
      return jwt.sign(cleanPayload, secret, {
        expiresIn: this.config.accessTokenExpiresIn,
      });
    } catch (err) {
      throw new AuthenticationError(
        'Failed to generate access token',
        ErrorCodes.GENERATE_TOKEN_FAILED
      );
    }
  }

  /**
   * Generates a refresh token
   */
  generateRefreshToken(payload: TokenPayload): string {
    try {
      const secret = this.config.refreshTokenSecret;

      if (!secret) {
        throw new AuthenticationError(
          'Refresh token secret is not configured',
          ErrorCodes.GENERATE_TOKEN_FAILED
        );
      }

      // Sanitize payload to remove existing JWT claims
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, nbf, jti, ...cleanPayload } = payload as any;
      // @ts-ignore
      return jwt.sign(cleanPayload, secret, {
        expiresIn: this.config.refreshTokenExpiresIn,
      });
    } catch (err) {
      throw new AuthenticationError(
        'Failed to generate refresh token',
        ErrorCodes.GENERATE_TOKEN_FAILED
      );
    }
  }

  /**
   * Generates both access and refresh tokens
   */
  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Parse expiration time (e.g., "1h" -> 3600 seconds)
    const expiresIn = this.parseExpirationTime(this.config.accessTokenExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Verifies and decodes an access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.accessTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Access token has expired', ErrorCodes.TOKEN_EXPIRED);
      }
      throw new AuthenticationError('Invalid access token', ErrorCodes.INVALID_TOKEN);
    }
  }

  /**
   * Verifies and decodes a refresh token
   */
  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.refreshTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Refresh token has expired', ErrorCodes.TOKEN_EXPIRED);
      }
      throw new AuthenticationError('Invalid refresh token', ErrorCodes.INVALID_TOKEN);
    }
  }

  /**
   * Parses expiration time string to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 3600; // Default to 1 hour
    }
  }
}
