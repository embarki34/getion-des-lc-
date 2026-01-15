import { Company } from "../entities/Company";

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findById(id: string): Promise<Company | null>;
  findByCode(code: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  findByParentCompanyId(parentCompanyId: string): Promise<Company[]>;
  findRootCompanies(): Promise<Company[]>;
  delete(id: string): Promise<void>;
}

