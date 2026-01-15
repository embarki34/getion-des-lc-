import { CompanySupplierRepository } from '../../domain/repositories/CompanySupplierRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { SupplierRepository } from '../../domain/repositories/SupplierRepository';

export class AssignSupplierToCompanyCommand {
  constructor(
    public readonly companyId: string,
    public readonly supplierId: string
  ) {}
}

export class AssignSupplierToCompanyCommandHandler {
  constructor(
    private readonly repository: CompanySupplierRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(command: AssignSupplierToCompanyCommand): Promise<void> {
    // Verify company exists
    const company = await this.companyRepository.findById(command.companyId);
    if (!company) {
      throw new Error(`Company with ID '${command.companyId}' not found`);
    }

    // Verify supplier exists
    const supplier = await this.supplierRepository.findById(command.supplierId);
    if (!supplier) {
      throw new Error(`Supplier with ID '${command.supplierId}' not found`);
    }

    // Check if already assigned
    const isAssigned = await this.repository.isSupplierAssignedToCompany(
      command.companyId,
      command.supplierId
    );
    if (isAssigned) {
      throw new Error(
        `Supplier '${command.supplierId}' is already assigned to company '${command.companyId}'`
      );
    }

    await this.repository.assignSupplierToCompany(command.companyId, command.supplierId);
  }
}

