export interface CreateBankAccountDTO {
  accountNumber: string;
  keyAccount: string;
  currency: string;
  rib?: string;
  bankId: string; // To link to a Banque, though aggregate root might handle this differently
  isActive?: boolean;
}

export interface UpdateBankAccountDTO {
  accountNumber?: string;
  keyAccount?: string;
  currency?: string;
  rib?: string;
  isActive?: boolean;
}

export interface BankAccountResponseDTO {
  id: string;
  accountNumber: string;
  keyAccount: string;
  swiftIdentifier: string; // Derived field
  currency: string;
  rib?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
