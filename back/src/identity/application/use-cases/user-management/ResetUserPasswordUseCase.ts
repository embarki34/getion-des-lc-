import { UserId } from "../../../domain/value-objects/UserId";
import { Password } from "../../../domain/value-objects/Password";
import { IUserRepository } from "../../ports/IUserRepository";
import { IPasswordHashingService } from "../../../domain/services/IPasswordHashingService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { IEmailService } from "../../ports/IEmailService";
import { SuccessResponse } from "../../dtos/Responses";
import {
    UserNotFoundException,
    ValidationException,
} from "../../../domain/exceptions/DomainExceptions";
import { PasswordResetByAdminEvent } from "../../../domain/events/IdentityEvents";
import { Result } from "../../../../shared/types/Result";

export interface ResetUserPasswordRequest {
    adminId: string;
    targetUserId: string;
    newPassword: string;
    sendEmail?: boolean;
}

/**
 * Use case for admin resetting user password
 * Allows administrators to reset passwords for other users
 */
export class ResetUserPasswordUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHashingService: IPasswordHashingService,
        private readonly eventPublisher: IEventPublisher,
        private readonly emailService: IEmailService
    ) { }

    /**
     * Executes the reset user password use case
     */
    async execute(
        request: ResetUserPasswordRequest
    ): Promise<Result<SuccessResponse, Error>> {
        try {
            // 1. Verify the admin exists and has appropriate permissions
            const adminId = UserId.fromString(request.adminId);
            const admin = await this.userRepository.findById(adminId);

            if (!admin) {
                return Result.fail(new ValidationException("Admin not found"));
            }



            // 2. Find target user
            const targetUserId = UserId.fromString(request.targetUserId);
            const targetUser = await this.userRepository.findById(targetUserId);

            if (!targetUser) {
                return Result.fail(
                    new UserNotFoundException(
                        `User with ID ${request.targetUserId} not found`
                    )
                );
            }

            // 3. Prevent admin from resetting their own password through this use case
            if (request.adminId === request.targetUserId) {
                return Result.fail(
                    new Error(
                        "Cannot reset your own password. Use change password instead."
                    )
                );
            }

            // 4. Create and hash new password
            const newPassword = Password.create(request.newPassword);
            const hashedPassword = await this.passwordHashingService.hash(
                newPassword
            );

            // 5. Update user password
            targetUser.changePassword(hashedPassword);
            await this.userRepository.update(targetUser);

            // 6. Publish event for audit logging
            const event = new PasswordResetByAdminEvent(
                targetUser.getId().getValue(),
                targetUser.getEmail().getValue(),
                admin.getId().getValue(),
                admin.getEmail().getValue()
            );
            await this.eventPublisher.publish(event);

            // 7. Send notification email to the user if requested
            if (request.sendEmail !== false) {
                this.emailService
                    .sendPasswordChangedEmail(
                        targetUser.getEmail().getValue(),
                        targetUser.getName()
                    )
                    .catch((error: Error) => {
                        console.error("Failed to send password reset email:", error);
                    });
            }

            return Result.ok(
                new SuccessResponse(
                    `Password reset successfully for user ${targetUser.getName()}`
                )
            );
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error("Failed to reset user password"));
        }
    }
}
