export interface BankAccount {
  id: string;
  accountNumber: string;
  keyAccount: string;
  currency: string;
  rib?: string; // Relevé d'Identité Bancaire
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  deletedBy: string | null;
}

export interface Banque {
  id: string;
  nom: string;
  codeSwift: string;
  codeGuichet?: string; // Branch code
  establishment: string;
  bankAccounts: BankAccount[];
  adresse: string;
  contactInfo?: string;
  // Audit fields
  createdAt?: Date;
  updatedAt?: Date;
}

// Legacy Bank interface for backward compatibility
export interface Bank {
  id: string;
  swiftCode: string;
  name: string;
  address: string;
  contactInfo?: string;
  creditLinesCount: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface Thresholds {
  seuilAvanceSurStock: number;
  seuilAvanceSurFacture: number;
  seuilEscompte: number;
  seuilLC: number;
  seuilObligtDouane: number;
  seuilCautionAdmin: number;
  seuilDcvrtMobile: number;
  seuilTrsfrLibre: number;
  seuilLeasing: number;
  seuilCMT: number;
  seuilFraisMission: number;
  seuilLCAS: number;
  [key: string]: number;
}

export interface ConsumptionBreakdown {
  avanceSurStock: number;
  avanceFacture: number;
  escompte: number;
  obligatDouane: number;
  cautionAdmin: number;
  dcvrtMobile: number;
  trsfrLibre: number;
  leasing: number;
  CMT: number;
  fraisMission: number;
  LCAS: number;
  faciliteCaissier: number;
  [key: string]: number;
}

export type CreditLineStatus =
  | "OUVERT"
  | "CLOTURE"
  | "SUSPENDU"
  | "EXPÉDIÉ"
  | "UTILISÉ";

export interface CreditLine {
  id: string;
  no: string;
  description?: string;
  banqueId: string;
  autorisationNo: string;
  bankAccountNo: string;

  // Financials
  montantPlafond: number; // Was authorizedAmount
  montantDevise: string; // Was currency
  taux: number;
  commitmentCommissionRate: number;

  // Status Tracking
  consumption: number;
  outstanding: number; // Calculated (Plafond - Consumption) or Debt?

  // Dates
  startDate: Date;
  expiryDate: Date;
  renewalDate?: Date;

  // State
  statut: CreditLineStatus;
  responsibilityCenter?: string;
  typeFinancement: string;

  // Logic
  maxConsumptionTolerance: number;
  minConsumptionTolerance: number;
  noSeries: string;
  refinancing: number;

  // Complex Objects
  thresholds: Thresholds;
  consumptionBreakdown: ConsumptionBreakdown;

  // Computed for UI convenience (optional)
  utilizationPercentage?: number;

  garanties?: Guarantee[];
}

// ...

export interface Guarantee {
  id: string;
  creditLineId?: string;
  creditLineNo?: string; // Added for display
  type: string;
  montant: number; // Matched with backend DTO
  // currency: string; // Backend doesn't seem to return currency for guarantee specifically (it uses parent line currency)
  dateExpiration: Date | string;
  description?: string;
  status?: string; // Relaxed to include Credit Line statuses
}

export interface Engagement {
  id: string;
  creditLineId: string;
  type: string;
  amount: number;
  currency: string;
  issueDate: Date;
  expiryDate: Date;
  beneficiary: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface SwiftMessage {
  id: string;
  reference: string;
  type: string; // MT700, MT707, etc.
  direction: "INCOMING" | "OUTGOING";
  bankId: string;
  date: Date;
  status: "PROCESSED" | "FAILED" | "PENDING";
  contentPreview: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  uploadedBy: string;
  entityType: "CREDIT_LINE" | "BANK" | "COMPANY";
  entityId: string;
}

export interface Company {
  id: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  parentCompany?: string;
  businessUnitsCount: number;
  usersCount: number;
  suppliersCount: number;
  banksCount: number;
  isActive: boolean;
}

export interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  description?: string;
  companyId: string;
  companyName: string;
  usersCount: number;
  suppliersCount: number;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactInfo: string;
  address: string;
  companiesCount: number;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  lastLogin?: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  resource: string;
  action: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
  code: string;
  permissionsCount: number;
  usersCount: number;
  permissions?: Permission[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}
