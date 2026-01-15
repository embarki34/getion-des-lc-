import { UserId } from '../../domain/value-objects/UserId';

/**
 * Token payload interface
 */
export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Token pair interface
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Port for token service
 * Handles JWT token generation and validation
 */
export interface ITokenService {
    /**
     * Generates an access token
     */
    generateAccessToken(payload: TokenPayload): string;

    /**
     * Generates a refresh token
     */
    generateRefreshToken(payload: TokenPayload): string;

    /**
     * Generates both access and refresh tokens
     */
    generateTokenPair(payload: TokenPayload): TokenPair;

    /**
     * Verifies and decodes an access token
     */
    verifyAccessToken(token: string): TokenPayload;

    /**
     * Verifies and decodes a refresh token
     */
    verifyRefreshToken(token: string): TokenPayload;
}
