import { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { Supplier } from '../../domain/entities/Supplier';

export class GetSupplierByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetSupplierByIdQueryHandler {
  constructor(private readonly repository: SupplierRepository) {}

  async execute(query: GetSupplierByIdQuery): Promise<Supplier | null> {
    return await this.repository.findById(query.id);
  }
}

