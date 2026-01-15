import { IUserRepository } from "../../ports/IUserRepository";
import { Result } from "../../../../shared/types/Result";
import { UserId } from "../../../domain/value-objects/UserId";
import { UserNotFoundException } from "../../../domain/exceptions/DomainExceptions";

export interface DeleteUserRequest {
    targetUserId: string;
    adminId: string;
}

export class DeleteUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(request: DeleteUserRequest): Promise<Result<void>> {
        try {
            // 1. Validate Target User ID
            const userId = UserId.fromString(request.targetUserId);

            // 2. Check if user exists
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return Result.fail(new UserNotFoundException("User not found"));
            }

            // 3. Prevent self-deletion
            if (request.adminId === request.targetUserId) {
                return Result.fail(new Error("You cannot delete your own account"));
            }

            // 4. Delete user
            await this.userRepository.delete(userId);

            return Result.ok(undefined);
        } catch (error) {
            console.error("Error deleting user:", error);
            return Result.fail(error instanceof Error ? error : new Error("Failed to delete user"));
        }
    }
}
