export interface CreateBusinessUnitDTO {
  name: string;
  code: string;
  description?: string;
  companyId: string;
  isActive?: boolean;
}

export interface UpdateBusinessUnitDTO {
  name?: string;
  code?: string;
  description?: string;
  companyId?: string;
  isActive?: boolean;
}

export interface BusinessUnitResponseDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

