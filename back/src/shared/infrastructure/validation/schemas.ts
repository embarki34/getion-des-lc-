import { z } from 'zod';

const ThresholdsSchema = z.object({
  seuilAvanceSurStock: z.number().nonnegative(),
  seuilAvanceSurFacture: z.number().nonnegative(),
  seuilEscompte: z.number().nonnegative(),
  seuilLC: z.number().nonnegative(),
  seuilObligtDouane: z.number().nonnegative(),
  seuilCautionAdmin: z.number().nonnegative(),
  seuilDcvrtMobile: z.number().nonnegative(),
  seuilTrsfrLibre: z.number().nonnegative(),
  seuilLeasing: z.number().nonnegative(),
  seuilCMT: z.number().nonnegative(),
  seuilFraisMission: z.number().nonnegative(),
  seuilLCAS: z.number().nonnegative(),
});

export const CreateLigneDeCreditSchema = z.object({
  no: z.string().min(1, 'Number is required'),
  banqueId: z.string().uuid('Invalid bank ID format'),
  description: z.string().optional(),
  autorisationNo: z.string().min(1),
  bankAccountNo: z.string().min(1),

  montantPlafond: z.number().positive('Plafond must be positive'),
  montantDevise: z.string().min(3).max(3, 'Currency must be 3 characters'),
  taux: z.number().min(0),
  commitmentCommissionRate: z.number().min(0),

  startDate: z.string().datetime('Invalid start date format'),
  expiryDate: z.string().datetime('Invalid end date format'),

  typeFinancement: z.string().min(1),
  responsibilityCenter: z.string().optional(),

  maxConsumptionTolerance: z.number().nonnegative(),
  minConsumptionTolerance: z.number().nonnegative(),
  noSeries: z.string(),
  refinancing: z.number(),

  thresholds: ThresholdsSchema,

  garanties: z
    .array(
      z.object({
        type: z.string(),
        montant: z.number().positive(),
        dateExpiration: z.string().datetime(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export const GenerateSwiftMT700Schema = z.object({
  referenceDossier: z.string().min(1, 'Reference is required'),
  applicantName: z.string().min(1, 'Applicant name is required'),
  applicantAddress: z.string().min(1, 'Applicant address is required'),
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  beneficiaryAddress: z.string().min(1, 'Beneficiary address is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  expiryDate: z.string().datetime('Invalid expiry date'),
  description: z.string().min(1, 'Description is required'),
  issuingBankSwift: z.string().min(8).max(11, 'Invalid SWIFT code'),
  advisingBankSwift: z.string().min(8).max(11).optional(),
});

export const CreateBanqueSchema = z.object({
  nom: z.string().min(1, 'Name is required'),
  codeSwift: z.string().min(8).max(11, 'Invalid SWIFT code'),
  codeGuichet: z.string().optional(),
  establishment: z.string().optional(),
  adresse: z.string().min(1, 'Address is required'),
  contactInfo: z.string().optional(),
  bankAccounts: z
    .array(
      z.object({
        accountNumber: z.string().min(1),
        currency: z.string().length(3),
        keyAccount: z.string().min(1),
        rib: z.string().optional(),
      })
    )
    .optional(),
});

export const UpdateBanqueSchema = z.object({
  nom: z.string().min(1).optional(),
  codeSwift: z.string().min(8).max(11).optional(),
  codeGuichet: z.string().optional(),
  establishment: z.string().optional(),
  adresse: z.string().min(1).optional(),
  contactInfo: z.string().optional(),
});
