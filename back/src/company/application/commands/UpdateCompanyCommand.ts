import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { UpdateCompanyDTO } from '../dto/CompanyDTO';

export class UpdateCompanyCommand {
  constructor(public readonly id: string, public readonly dto: UpdateCompanyDTO) {}
}

export class UpdateCompanyCommandHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(command: UpdateCompanyCommand): Promise<void> {
    const company = await this.repository.findById(command.id);
    if (!company) {
      throw new Error(`Company with ID '${command.id}' not found`);
    }

    // Update fields if provided
    if (command.dto.name !== undefined) {
      company.updateName(command.dto.name);
    }

    if (command.dto.description !== undefined) {
      company.updateDescription(command.dto.description);
    }

    if (command.dto.address !== undefined) {
      company.updateAddress(command.dto.address);
    }

    if (command.dto.contactInfo !== undefined) {
      company.updateContactInfo(command.dto.contactInfo);
    }

    if (command.dto.parentCompanyId !== undefined) {
      // Prevent circular references
      if (command.dto.parentCompanyId) {
        // Check if the parent company exists
        const parentCompany = await this.repository.findById(command.dto.parentCompanyId);
        if (!parentCompany) {
          throw new Error(`Parent company with ID '${command.dto.parentCompanyId}' not found`);
        }

        // Check for circular reference by verifying the parent is not a descendant
        let currentId = command.dto.parentCompanyId;
        const visited = new Set<string>([command.id]);
        while (currentId) {
          if (visited.has(currentId)) {
            throw new Error('Circular reference detected in company hierarchy');
          }
          visited.add(currentId);
          const current = await this.repository.findById(currentId);
          if (!current || !current['props'].parentCompanyId) break;
          currentId = current['props'].parentCompanyId;
        }
      }
      company.setParentCompany(command.dto.parentCompanyId);
    }

    if (command.dto.isActive !== undefined) {
      if (command.dto.isActive) {
        company.activate();
      } else {
        company.deactivate();
      }
    }

    await this.repository.save(company);
  }
}

