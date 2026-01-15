import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';

export class GetCompanyByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetCompanyByIdQueryHandler {
  constructor(private readonly repository: CompanyRepository) {}

  async execute(query: GetCompanyByIdQuery): Promise<Company | null> {
    return await this.repository.findById(query.id);
  }
}

