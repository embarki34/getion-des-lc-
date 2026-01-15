import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { BusinessUnit } from '../../domain/entities/BusinessUnit';

export class GetBusinessUnitByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetBusinessUnitByIdQueryHandler {
  constructor(private readonly repository: BusinessUnitRepository) {}

  async execute(query: GetBusinessUnitByIdQuery): Promise<BusinessUnit | null> {
    return await this.repository.findById(query.id);
  }
}

