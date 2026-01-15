import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';

export class GetAllCompaniesQuery {
  constructor(public readonly includeInactive: boolean = false) {}
}

export class GetAllCompaniesQueryHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(query: GetAllCompaniesQuery): Promise<Company[]> {
    const allCompanies = await this.repository.findAll();
    if (query.includeInactive) {
      return allCompanies;
    }
    return allCompanies.filter((c) => c.isActive);
  }
}

