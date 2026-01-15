import { CompanyBanqueRepository } from '../../domain/repositories/CompanyBanqueRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { BanqueRepository } from '../../../bank-swift/domain/repositories/BanqueRepository';

export class AssignBanqueToCompanyCommand {
  constructor(public readonly companyId: string, public readonly banqueId: string) {}
}

export class AssignBanqueToCompanyCommandHandler {
  constructor(
    private readonly repository: CompanyBanqueRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly banqueRepository: BanqueRepository
  ) {}

  async execute(command: AssignBanqueToCompanyCommand): Promise<void> {
    // Verify company exists
    const company = await this.companyRepository.findById(command.companyId);
    if (!company) {
      throw new Error(`Company with ID '${command.companyId}' not found`);
    }

    // Verify banque exists
    const banque = await this.banqueRepository.findById(command.banqueId);
    if (!banque) {
      throw new Error(`Banque with ID '${command.banqueId}' not found`);
    }

    // Check if already assigned
    const isAssigned = await this.repository.isBanqueAssignedToCompany(
      command.companyId,
      command.banqueId
    );
    if (isAssigned) {
      throw new Error(
        `Banque '${command.banqueId}' is already assigned to company '${command.companyId}'`
      );
    }

    await this.repository.assignBanqueToCompany(command.companyId, command.banqueId);
  }
}

