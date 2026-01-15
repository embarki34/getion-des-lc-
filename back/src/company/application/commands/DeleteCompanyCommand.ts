import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class DeleteCompanyCommand {
  constructor(public readonly id: string) {}
}

export class DeleteCompanyCommandHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(command: DeleteCompanyCommand): Promise<void> {
    const company = await this.repository.findById(command.id);
    if (!company) {
      throw new Error(`Company with ID '${command.id}' not found`);
    }

    // Check if company has sub-companies
    const subCompanies = await this.repository.findByParentCompanyId(command.id);
    if (subCompanies.length > 0) {
      throw new Error(`Cannot delete company with ID '${command.id}' because it has ${subCompanies.length} sub-companies. Please delete or reassign them first.`);
    }

    await this.repository.delete(command.id);
  }
}

