import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../ports/IUserRepository";
import { Result } from "../../../../shared/types/Result";
import { ValidationException } from "../../../domain/exceptions/DomainExceptions";

export class GetUsersByBusinessUnitUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(businessUnitId: string): Promise<Result<User[]>> {
        try {
            if (!businessUnitId) {
                return Result.fail(new ValidationException("Business Unit ID is required"));
            }

            const users = await this.userRepository.findByBusinessUnitId(businessUnitId);

            return Result.ok(users);
        } catch (err) {
            return Result.fail(err as Error);
        }
    }
}
