import { BusinessUnit } from "../entities/BusinessUnit";

export interface BusinessUnitRepository {
  save(businessUnit: BusinessUnit): Promise<void>;
  findById(id: string): Promise<BusinessUnit | null>;
  findByCode(code: string, companyId: string): Promise<BusinessUnit | null>;
  findAll(): Promise<BusinessUnit[]>;
  findByCompanyId(companyId: string): Promise<BusinessUnit[]>;
  delete(id: string): Promise<void>;
}

