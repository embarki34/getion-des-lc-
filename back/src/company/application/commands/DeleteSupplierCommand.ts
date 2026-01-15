import { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class DeleteSupplierCommand {
  constructor(public readonly id: string) {}
}

export class DeleteSupplierCommandHandler {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(command: DeleteSupplierCommand): Promise<void> {
    const supplier = await this.repository.findById(command.id);
    if (!supplier) {
      throw new Error(`Supplier with ID '${command.id}' not found`);
    }

    await this.repository.delete(command.id);
  }
}

