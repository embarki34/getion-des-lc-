import { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { UpdateSupplierDTO } from '../dto/SupplierDTO';

export class UpdateSupplierCommand {
  constructor(public readonly id: string, public readonly dto: UpdateSupplierDTO) {}
}

export class UpdateSupplierCommandHandler {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(command: UpdateSupplierCommand): Promise<void> {
    const supplier = await this.repository.findById(command.id);
    if (!supplier) {
      throw new Error(`Supplier with ID '${command.id}' not found`);
    }

    if (command.dto.name !== undefined) {
      supplier.updateName(command.dto.name);
    }

    if (command.dto.description !== undefined) {
      supplier.updateDescription(command.dto.description);
    }

    if (command.dto.contactInfo !== undefined) {
      supplier.updateContactInfo(command.dto.contactInfo);
    }

    if (command.dto.address !== undefined) {
      supplier.updateAddress(command.dto.address);
    }

    if (command.dto.isActive !== undefined) {
      if (command.dto.isActive) {
        supplier.activate();
      } else {
        supplier.deactivate();
      }
    }

    await this.repository.save(supplier);
  }
}

