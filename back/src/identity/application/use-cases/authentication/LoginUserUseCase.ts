import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { IUserRepository } from "../../ports/IUserRepository";
import { IPasswordHashingService } from "../../../domain/services/IPasswordHashingService";
import { ITokenService, TokenPayload } from "../../ports/ITokenService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { LoginRequest } from "../../dtos/Requests";
import { AuthenticationResponse, UserResponse } from "../../dtos/Responses";
import {
  InvalidCredentialsException,
  UserNotFoundException,
} from "../../../domain/exceptions/DomainExceptions";
import { UserLoggedInEvent } from "../../../domain/events/IdentityEvents";
import { Result } from "../../../../shared/types/Result";

/**
 * Use case for user login
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: IPasswordHashingService,
    private readonly tokenService: ITokenService,
    private readonly eventPublisher: IEventPublisher
  ) {}

  /**
   * Executes the login user use case
   */
  async execute(
    request: LoginRequest
  ): Promise<Result<AuthenticationResponse, Error>> {
    try {
      // 1. Create email value object
      const email = Email.create(request.email);
      const plainPassword = Password.create(request.password);

      // 2. Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return Result.fail(new InvalidCredentialsException());
      }

      // 3. Check if user can login (account status, email verification, locked)
      try {
        user.canLogin();
      } catch (error) {
        return Result.fail(error as Error);
      }

      // 4. Verify password
      const isPasswordValid = await this.passwordHashingService.compare(
        plainPassword,
        user.getPassword()
      );

      //   console.log("isPasswordValid", isPasswordValid);
      //   console.log("user.getPassword()", user.getPassword());
      //   console.log("plainPassword", plainPassword.getValue());
      if (!isPasswordValid) {
        // Record failed login attempt
        user.recordFailedLoginAttempt();
        await this.userRepository.update(user);
        return Result.fail(new InvalidCredentialsException());
      }

      // 5. Record successful login
      user.recordSuccessfulLogin();
      await this.userRepository.update(user);

      // 6. Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.getId().getValue(),
        email: user.getEmail().getValue(),
        role: user.getRole(),
      };
      const tokenPair = this.tokenService.generateTokenPair(tokenPayload);

      // 7. Publish domain event
      const event = new UserLoggedInEvent(
        user.getId().getValue(),
        user.getEmail().getValue(),
        new Date()
      );
      await this.eventPublisher.publish(event);

      // 8. Return response
      const userResponse = new UserResponse(
        user.getId().getValue(),
        user.getName(),
        user.getEmail().getValue(),
        user.getRole(),
        user.getStatus(),
        user.isEmailVerified(),
        user.getCreatedAt(),
        user.getLastLoginAt()
      );

      const response = new AuthenticationResponse(
        tokenPair.accessToken,
        tokenPair.refreshToken,
        tokenPair.expiresIn,
        userResponse
      );

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
