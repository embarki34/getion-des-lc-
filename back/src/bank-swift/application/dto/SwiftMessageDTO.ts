import { SwiftMessageType } from '../../domain/entities/SwiftMessage';

export interface SwiftMT700DTO {
  referenceDossier: string;
  applicantName: string;
  applicantAddress: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
  issuingBankSwift: string;
  advisingBankSwift?: string;
}

export interface SwiftMessageResponseDTO {
  id: string;
  type: SwiftMessageType;
  content: string;
  referenceDossier: string;
  statut: string;
  dateGeneration: Date;
}
