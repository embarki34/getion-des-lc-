import { UserId } from "../../../domain/value-objects/UserId";
import { IUserRepository } from "../../ports/IUserRepository";
import { ProfileResponse } from "../../dtos/Responses";
import { UserNotFoundException } from "../../../domain/exceptions/DomainExceptions";
import { Result } from "../../../../shared/types/Result";

/**
 * Use case for getting user profile
 */
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the get user profile use case
   */
  async execute(userId: string): Promise<Result<ProfileResponse, Error>> {
    try {
      // 1. Find user
      const userIdVO = UserId.fromString(userId);
      const user = await this.userRepository.findById(userIdVO);

      if (!user) {
        return Result.fail(new UserNotFoundException(userId));
      }

      // 2. Return profile response
      const response = new ProfileResponse(
        user.getId().getValue(),
        user.getName(),
        user.getEmail().getValue(),
        user.getRole(),
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
