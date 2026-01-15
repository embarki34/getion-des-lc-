import { ITokenService, TokenPayload } from '../../ports/ITokenService';
import { RefreshTokenRequest } from '../../dtos/Requests';
import { Result } from '../../../../shared/types/Result';
import { AuthenticationError } from '../../../../shared/errors/ConcreteErrors';
import { ErrorCodes } from '../../../../shared/errors/ErrorCodes';

/**
 * Token refresh response
 */
export class TokenRefreshResponse {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number
  ) {}
}

/**
 * Use case for refreshing access token
 */
export class RefreshTokenUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  /**
   * Executes the refresh token use case
   */
  async execute(request: RefreshTokenRequest): Promise<Result<TokenRefreshResponse, Error>> {
    try {
      // 1. Verify refresh token
      const payload = this.tokenService.verifyRefreshToken(request.refreshToken);
      console.log('payload pass', payload);

      // 2. Generate new token pair
      const tokenPair = this.tokenService.generateTokenPair(payload);

      // 3. Return response
      const response = new TokenRefreshResponse(
        tokenPair.accessToken,
        tokenPair.refreshToken,
        tokenPair.expiresIn
      );

      return Result.ok(response);
    } catch (error) {
      console.log(error);
      return Result.fail(
        new AuthenticationError('Invalid or expired refresh token', ErrorCodes.TOKEN_EXPIRED)
      );
    }
  }
}
