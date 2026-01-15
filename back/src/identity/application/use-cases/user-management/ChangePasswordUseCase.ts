import { UserId } from "../../../domain/value-objects/UserId";
import { Password } from "../../../domain/value-objects/Password";
import { IUserRepository } from "../../ports/IUserRepository";
import { IPasswordHashingService } from "../../../domain/services/IPasswordHashingService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { IEmailService } from "../../ports/IEmailService";
import { ChangePasswordRequest } from "../../dtos/Requests";
import { SuccessResponse } from "../../dtos/Responses";
import {
  UserNotFoundException,
  InvalidCredentialsException,
} from "../../../domain/exceptions/DomainExceptions";
import { PasswordChangedEvent } from "../../../domain/events/IdentityEvents";
import { Result } from "../../../../shared/types/Result";

/**
 * Use case for changing user password
 */
export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: IPasswordHashingService,
    private readonly eventPublisher: IEventPublisher,
    private readonly emailService: IEmailService
  ) {}

  /**
   * Executes the change password use case
   */
  async execute(
    request: ChangePasswordRequest
  ): Promise<Result<SuccessResponse, Error>> {
    try {
      // 1. Find user
      const userId = UserId.fromString(request.userId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return Result.fail(new UserNotFoundException(request.userId));
      }

      // 2. Verify current password
      const currentPassword = Password.create(request.currentPassword);
      const isCurrentPasswordValid = await this.passwordHashingService.compare(
        currentPassword,
        user.getPassword()
      );

      if (!isCurrentPasswordValid) {
        return Result.fail(new InvalidCredentialsException());
      }

      // 3. Create and hash new password
      const newPassword = Password.create(request.newPassword);
      const hashedPassword = await this.passwordHashingService.hash(
        newPassword
      );

      // 4. Change password
      user.changePassword(hashedPassword);
      await this.userRepository.update(user);

      // 5. Publish event
      const event = new PasswordChangedEvent(
        user.getId().getValue(),
        user.getEmail().getValue()
      );
      await this.eventPublisher.publish(event);

      // 6. Send notification email
      this.emailService
        .sendPasswordChangedEmail(user.getEmail().getValue(), user.getName())
        .catch((error) => {
          console.error("Failed to send password changed email:", error);
        });

      return Result.ok(new SuccessResponse("Password changed successfully"));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
