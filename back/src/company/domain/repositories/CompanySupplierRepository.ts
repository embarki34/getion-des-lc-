export interface CompanySupplierRepository {
  assignSupplierToCompany(companyId: string, supplierId: string): Promise<void>;
  removeSupplierFromCompany(companyId: string, supplierId: string): Promise<void>;
  findSuppliersByCompanyId(companyId: string): Promise<string[]>; // Returns supplier IDs
  findCompaniesBySupplierId(supplierId: string): Promise<string[]>; // Returns company IDs
  isSupplierAssignedToCompany(companyId: string, supplierId: string): Promise<boolean>;
}

