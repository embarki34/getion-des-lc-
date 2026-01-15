import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';

export class GetCompaniesByParentQuery {
  constructor(public readonly parentCompanyId: string | null) {}
}

export class GetCompaniesByParentQueryHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(query: GetCompaniesByParentQuery): Promise<Company[]> {
    if (query.parentCompanyId === null) {
      return await this.repository.findRootCompanies();
    }
    return await this.repository.findByParentCompanyId(query.parentCompanyId);
  }
}

