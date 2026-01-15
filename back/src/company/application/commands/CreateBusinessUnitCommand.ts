import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { BusinessUnit } from '../../domain/entities/BusinessUnit';
import { CreateBusinessUnitDTO } from '../dto/BusinessUnitDTO';

export class CreateBusinessUnitCommand {
  constructor(public readonly dto: CreateBusinessUnitDTO) {}
}

export class CreateBusinessUnitCommandHandler {
  constructor(
    private readonly repository: BusinessUnitRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async execute(command: CreateBusinessUnitCommand): Promise<string> {
    // Verify company exists
    const company = await this.companyRepository.findById(command.dto.companyId);
    if (!company) {
      throw new Error(`Company with ID '${command.dto.companyId}' not found`);
    }

    // Check if code already exists for this company
    const existing = await this.repository.findByCode(
      command.dto.code,
      command.dto.companyId
    );
    if (existing) {
      throw new Error(
        `Business unit with code '${command.dto.code}' already exists for this company`
      );
    }

    const businessUnit = BusinessUnit.create({
      name: command.dto.name,
      code: command.dto.code,
      description: command.dto.description,
      companyId: command.dto.companyId,
      isActive: command.dto.isActive ?? true,
    });

    await this.repository.save(businessUnit);
    return businessUnit.id;
  }
}

