export interface CreateSupplierDTO {
  name: string;
  code: string;
  description?: string;
  contactInfo?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateSupplierDTO {
  name?: string;
  description?: string;
  contactInfo?: string;
  address?: string;
  isActive?: boolean;
}

export interface SupplierResponseDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  contactInfo?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

