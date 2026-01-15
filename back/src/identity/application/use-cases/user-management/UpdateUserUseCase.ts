import { IUserRepository } from "../../ports/IUserRepository";
import { UserId } from "../../../domain/value-objects/UserId";
import { Result } from "../../../../shared/types/Result";
import { UserRole } from "../../../domain/value-objects/UserRole";
import { AccountStatus } from "../../../domain/value-objects/AccountStatus";
import { UserNotFoundException } from "../../../domain/exceptions/DomainExceptions";

export interface UpdateUserRequest {
    userId: string;
    name?: string;
    role?: UserRole;
    status?: AccountStatus;
}

/**
 * Use case for updating user information
 */
export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(request: UpdateUserRequest): Promise<Result<void>> {
        try {
            const userId = UserId.fromString(request.userId);
            const user = await this.userRepository.findById(userId);

            if (!user) {
                return Result.fail(new UserNotFoundException("we did not find the user"));
            }

            // Update user properties
            if (request.name) {
                user.updateName(request.name);
            }

            if (request.role) {
                user.changeRole(request.role);
            }

            if (request.status) {
                // Handle status changes using specific methods
                switch (request.status) {
                    case AccountStatus.ACTIVE:
                        user.activate();
                        break;
                    case AccountStatus.SUSPENDED:
                        user.suspend();
                        break;
                    case AccountStatus.DELETED:
                        user.delete();
                        break;
                    // PENDING status is set during registration, not updated here
                }
            }

            await this.userRepository.update(user);

            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(
                error instanceof Error ? error : new Error("Failed to update user")
            );
        }
    }
}
