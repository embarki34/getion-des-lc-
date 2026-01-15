import { IUserRepository } from "../../ports/IUserRepository";
import { User } from "../../../domain/entities/User";
import { Result } from "../../../../shared/types/Result";

/**
 * Use case for getting all users
 */
export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(): Promise<Result<User[], Error>> {
        try {
            const users = await this.userRepository.findAll();
            return Result.ok(users);
        } catch (error) {
            return Result.fail(
                error instanceof Error
                    ? error
                    : new Error("Failed to fetch users")
            );
        }
    }
}
