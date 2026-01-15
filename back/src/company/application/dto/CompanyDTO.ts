export interface CreateCompanyDTO {
  name: string;
  code: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  parentCompanyId?: string;
  isActive?: boolean;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  parentCompanyId?: string;
  isActive?: boolean;
}

export interface CompanyResponseDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  parentCompanyId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

