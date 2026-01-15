export interface CompanyBanqueRepository {
  assignBanqueToCompany(companyId: string, banqueId: string): Promise<void>;
  removeBanqueFromCompany(companyId: string, banqueId: string): Promise<void>;
  findBanquesByCompanyId(companyId: string): Promise<string[]>; // Returns banque IDs
  findCompaniesByBanqueId(banqueId: string): Promise<string[]>; // Returns company IDs
  isBanqueAssignedToCompany(companyId: string, banqueId: string): Promise<boolean>;
}

