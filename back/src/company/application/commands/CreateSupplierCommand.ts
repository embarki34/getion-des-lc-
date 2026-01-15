import { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { Supplier } from '../../domain/entities/Supplier';
import { CreateSupplierDTO } from '../dto/SupplierDTO';

export class CreateSupplierCommand {
  constructor(public readonly dto: CreateSupplierDTO) {}
}

export class CreateSupplierCommandHandler {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(command: CreateSupplierCommand): Promise<string> {
    // Check if code already exists
    const existingSupplier = await this.repository.findByCode(command.dto.code);
    if (existingSupplier) {
      throw new Error(`Supplier with code '${command.dto.code}' already exists`);
    }

    const supplier = Supplier.create({
      name: command.dto.name,
      code: command.dto.code,
      description: command.dto.description,
      contactInfo: command.dto.contactInfo,
      address: command.dto.address,
      isActive: command.dto.isActive ?? true,
    });

    await this.repository.save(supplier);
    return supplier.id;
  }
}

