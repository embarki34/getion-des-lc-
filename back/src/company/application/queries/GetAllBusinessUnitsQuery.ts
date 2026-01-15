import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { BusinessUnit } from '../../domain/entities/BusinessUnit';

export class GetAllBusinessUnitsQuery {
  constructor(
    public readonly companyId?: string,
    public readonly includeInactive: boolean = false
  ) {}
}

export class GetAllBusinessUnitsQueryHandler {
  constructor(private readonly repository: BusinessUnitRepository) {}

  async execute(query: GetAllBusinessUnitsQuery): Promise<BusinessUnit[]> {
    let businessUnits: BusinessUnit[];

    if (query.companyId) {
      businessUnits = await this.repository.findByCompanyId(query.companyId);
    } else {
      businessUnits = await this.repository.findAll();
    }

    if (query.includeInactive) {
      return businessUnits;
    }
    return businessUnits.filter((bu) => bu.isActive);
  }
}

