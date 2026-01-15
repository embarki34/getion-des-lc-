import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { UpdateBusinessUnitDTO } from '../dto/BusinessUnitDTO';

export class UpdateBusinessUnitCommand {
  constructor(public readonly id: string, public readonly dto: UpdateBusinessUnitDTO) { }
}

export class UpdateBusinessUnitCommandHandler {
  constructor(
    private readonly repository: BusinessUnitRepository,
    private readonly companyRepository: CompanyRepository
  ) { }

  async execute(command: UpdateBusinessUnitCommand): Promise<void> {
    const businessUnit = await this.repository.findById(command.id);
    if (!businessUnit) {
      throw new Error(`Business unit with ID '${command.id}' not found`);
    }

    if (command.dto.name !== undefined) {
      businessUnit.updateName(command.dto.name);
    }

    if (command.dto.code !== undefined) {
      businessUnit.updateCode(command.dto.code);
    }

    if (command.dto.description !== undefined) {
      businessUnit.updateDescription(command.dto.description);
    }

    if (command.dto.companyId !== undefined) {
      // Verify new company exists
      const company = await this.companyRepository.findById(command.dto.companyId);
      if (!company) {
        throw new Error(`Company with ID '${command.dto.companyId}' not found`);
      }
      businessUnit.changeCompany(command.dto.companyId);
    }

    if (command.dto.isActive !== undefined) {
      if (command.dto.isActive) {
        businessUnit.activate();
      } else {
        businessUnit.deactivate();
      }
    }

    await this.repository.save(businessUnit);
  }
}

