export interface BusinessUnitSupplierRepository {
  assignSupplierToBusinessUnit(businessUnitId: string, supplierId: string): Promise<void>;
  removeSupplierFromBusinessUnit(businessUnitId: string, supplierId: string): Promise<void>;
  findSuppliersByBusinessUnitId(businessUnitId: string): Promise<string[]>; // Returns supplier IDs
  findBusinessUnitsBySupplierId(supplierId: string): Promise<string[]>; // Returns business unit IDs
  isSupplierAssignedToBusinessUnit(businessUnitId: string, supplierId: string): Promise<boolean>;
}

