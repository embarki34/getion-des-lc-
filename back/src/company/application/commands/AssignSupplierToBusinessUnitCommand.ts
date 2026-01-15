import { BusinessUnitSupplierRepository } from '../../domain/repositories/BusinessUnitSupplierRepository';
import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class AssignSupplierToBusinessUnitCommand {
  constructor(
    public readonly businessUnitId: string,
    public readonly supplierId: string
  ) {}
}

export class AssignSupplierToBusinessUnitCommandHandler {
  constructor(
    private readonly repository: BusinessUnitSupplierRepository,
    private readonly businessUnitRepository: BusinessUnitRepository,
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(command: AssignSupplierToBusinessUnitCommand): Promise<void> {
    // Verify business unit exists
    const businessUnit = await this.businessUnitRepository.findById(command.businessUnitId);
    if (!businessUnit) {
      throw new Error(`Business unit with ID '${command.businessUnitId}' not found`);
    }

    // Verify supplier exists
    const supplier = await this.supplierRepository.findById(command.supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID '${command.supplierId}' not found`);
    }

    // Check if already assigned
    const isAssigned = await this.repository.isSupplierAssignedToBusinessUnit(
      command.businessUnitId,
      command.supplierId
    );
    if (isAssigned) {
      throw new Error(
        `Supplier '${command.supplierId}' is already assigned to business unit '${command.businessUnitId}'`
      );
    }

    await this.repository.assignSupplierToBusinessUnit(
      command.businessUnitId,
      command.supplierId
    );
  }
}

