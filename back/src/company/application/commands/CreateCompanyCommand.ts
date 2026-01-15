import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';
import { CreateCompanyDTO } from '../dto/CompanyDTO';

export class CreateCompanyCommand {
  constructor(public readonly dto: CreateCompanyDTO) {}
}

export class CreateCompanyCommandHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(command: CreateCompanyCommand): Promise<string> {
    // Check if code already exists
    const existingCompany = await this.repository.findByCode(command.dto.code);
    if (existingCompany) {
      throw new Error(`Company with code '${command.dto.code}' already exists`);
    }

    // If parent company is specified, verify it exists
    if (command.dto.parentCompanyId) {
      const parentCompany = await this.repository.findById(command.dto.parentCompanyId);
      if (!parentCompany) {
        throw new Error(`Parent company with ID '${command.dto.parentCompanyId}' not found`);
      }
    }

    const company = Company.create({
      name: command.dto.name,
      code: command.dto.code,
      description: command.dto.description,
      address: command.dto.address,
      contactInfo: command.dto.contactInfo,
      parentCompanyId: command.dto.parentCompanyId,
      isActive: command.dto.isActive ?? true,
    });

    await this.repository.save(company);
    return company.id;
  }
}

