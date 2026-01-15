import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { UserRole } from "../../../domain/value-objects/UserRole";
import { IUserRepository } from "../../ports/IUserRepository";
import { IPasswordHashingService } from "../../../domain/services/IPasswordHashingService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { IEmailService } from "../../ports/IEmailService";
import { RegisterUserRequest } from "../../dtos/Requests";
import { UserResponse } from "../../dtos/Responses";
import { UserAlreadyExistsException } from "../../../domain/exceptions/DomainExceptions";
import { UserCreatedEvent } from "../../../domain/events/IdentityEvents";
import { Result } from "../../../../shared/types/Result";

/**
 * Use case for registering a new user
 * Follows single responsibility principle
 */
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: IPasswordHashingService,
    private readonly eventPublisher: IEventPublisher,
    private readonly emailService: IEmailService
  ) {}

  /**
   * Executes the register user use case
   */
  async execute(
    request: RegisterUserRequest
  ): Promise<Result<UserResponse, Error>> {
    try {
      // 1. Create value objects (validation happens here)
      const email = Email.create(request.email);
      const password = Password.create(request.password);

      // 2. Check if user already exists
      const existingUser = await this.userRepository.existsByEmail(email);
      if (existingUser) {
        return Result.fail(new UserAlreadyExistsException(email.getValue()));
      }

      // 3. Hash the password
      const hashedPassword = await this.passwordHashingService.hash(password);

      // 4. Create user entity
      const user = User.create(
        request.name,
        email,
        request.phone || "",
        hashedPassword,
        UserRole.USER
      );

      // 5. Save user to repository
      await this.userRepository.save(user);

      // 6. Publish domain event
      const event = new UserCreatedEvent(
        user.getId().getValue(),
        user.getEmail().getValue(),
        user.getName()
      );
      await this.eventPublisher.publish(event);

      // 7. Send welcome email (async, don't wait)
      this.emailService
        .sendWelcomeEmail(user.getEmail().getValue(), user.getName())
        .catch((error) => {
          // Log error but don't fail the registration
          console.error("Failed to send welcome email:", error);
        });

      // 8. Return response DTO
      const response = new UserResponse(
        user.getId().getValue(),
        user.getName(),
        user.getEmail().getValue(),
        user.getRole(),
        user.getStatus(),
        user.isEmailVerified(),
        user.getCreatedAt(),
        user.getLastLoginAt()
      );

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
