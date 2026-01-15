import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';

export class DeleteBusinessUnitCommand {
  constructor(public readonly id: string) {}
}

export class DeleteBusinessUnitCommandHandler {
  constructor(private readonly repository: BusinessUnitRepository) {}

  async execute(command: DeleteBusinessUnitCommand): Promise<void> {
    const businessUnit = await this.repository.findById(command.id);
    if (!businessUnit) {
      throw new Error(`Business unit with ID '${command.id}' not found`);
    }

    await this.repository.delete(command.id);
  }
}

