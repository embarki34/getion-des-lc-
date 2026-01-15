import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { ValidationError } from '../../../shared/errors/ConcreteErrors';
import { ErrorCodes } from '../../../shared/errors/ErrorCodes';

export class DeleteCreditLineCommand {
    constructor(public readonly id: string) { }
}

export class DeleteCreditLineCommandHandler {
    constructor(private readonly repository: LigneDeCreditRepository) { }

    async execute(command: DeleteCreditLineCommand): Promise<void> {
        const { engagements } = await this.repository.countRelatedEntities(command.id);

        if (engagements > 0) {
            throw new ValidationError(
                'Cannot delete credit line because it has related engagements.',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        await this.repository.delete(command.id);
    }
}
