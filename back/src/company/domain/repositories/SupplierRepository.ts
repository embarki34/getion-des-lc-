import { Supplier } from "../entities/Supplier";

export interface SupplierRepository {
  save(supplier: Supplier): Promise<void>;
  findById(id: string): Promise<Supplier | null>;
  findByCode(code: string): Promise<Supplier | null>;
  findAll(): Promise<Supplier[]>;
  findByBusinessUnitId(businessUnitId: string): Promise<Supplier[]>;
  delete(id: string): Promise<void>;
}

