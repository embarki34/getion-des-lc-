import { BankAccountResponseDTO } from './BankAccountDTO';

export interface CreateBankAccountInput {
  accountNumber: string;
  currency: string;
  keyAccount: string;
  rib?: string;
}

export interface CreateBanqueDTO {
  nom: string;
  codeSwift: string;
  codeGuichet?: string;
  establishment: string;
  adresse: string;
  contactInfo?: string;
  bankAccounts?: CreateBankAccountInput[];
}

export interface UpdateBanqueDTO {
  nom?: string;
  codeSwift?: string;
  codeGuichet?: string;
  establishment?: string;
  adresse?: string;
  contactInfo?: string;
}

export interface BanqueResponseDTO {
  id: string;
  nom: string;
  codeSwift: string;
  codeGuichet?: string;
  establishment: string;
  adresse: string;
  contactInfo?: string;
  bankAccounts?: BankAccountResponseDTO[];
}
