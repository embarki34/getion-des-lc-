import { BanqueRepository } from '../../domain/repositories/BanqueRepository';

import { ValidationError } from '../../../shared/errors/ConcreteErrors';
import { ErrorCodes } from '../../../shared/errors/ErrorCodes';

export class DeleteBanqueCommand {
  constructor(public readonly id: string) { }
}

export class DeleteBanqueCommandHandler {
  constructor(private readonly repository: BanqueRepository) { }

  async execute(command: DeleteBanqueCommand): Promise<void> {
    const { accounts, creditLines } = await this.repository.countRelatedEntities(command.id);

    if (accounts > 0 || creditLines > 0) {
      throw new ValidationError(
        'Cannot delete bank because it has related accounts or credit lines.',
        ErrorCodes.VALIDATION_ERROR
      );
    }

    await this.repository.delete(command.id);
  }
}
