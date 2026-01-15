import { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { Supplier } from '../../domain/entities/Supplier';

export class GetAllSuppliersQuery {
  constructor(
    public readonly businessUnitId?: string,
    public readonly includeInactive: boolean = false
  ) { }
}

export class GetAllSuppliersQueryHandler {
  constructor(private readonly repository: SupplierRepository) { }

  async execute(query: GetAllSuppliersQuery): Promise<Supplier[]> {
    let suppliers: Supplier[];

    if (query.businessUnitId) {
      suppliers = await this.repository.findByBusinessUnitId(query.businessUnitId);
    } else {
      suppliers = await this.repository.findAll();
    }

    if (query.includeInactive) {
      return suppliers;
    }
    return suppliers.filter((s) => s.isActive);
  }
}

