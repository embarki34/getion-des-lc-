export interface GarantieDTO {
  id?: string;
  type: string;
  montant: number;
  dateExpiration: string;
  description?: string;
}

export interface ThresholdsDTO {
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
}

export interface ConsumptionBreakdownDTO {
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
}

export interface CreateLigneDeCreditDTO {
  no: string;
  banqueId: string;
  description?: string;
  autorisationNo: string;
  bankAccountNo: string;

  montantPlafond: number;
  montantDevise: string;
  taux: number;
  commitmentCommissionRate: number;

  startDate: string;
  expiryDate: string;

  typeFinancement: string;
  responsibilityCenter?: string;

  maxConsumptionTolerance: number;
  minConsumptionTolerance: number;
  noSeries: string;
  refinancing: number;

  thresholds: ThresholdsDTO;

  garanties?: GarantieDTO[];
}

export interface LigneDeCreditResponseDTO {
  id: string;
  no: string;
  banqueId: string;
  description?: string;
  autorisationNo: string;
  bankAccountNo: string;

  montantPlafond: number;
  montantDevise: string; // Changed from devise to match CreateDTO and Form
  taux: number;
  commitmentCommissionRate: number;

  statut: string;

  startDate: Date;
  expiryDate: Date;

  typeFinancement: string;
  responsibilityCenter?: string;

  maxConsumptionTolerance: number;
  minConsumptionTolerance: number;
  noSeries: string;
  refinancing: number;

  consumption: number;
  outstanding: number;

  thresholds: ThresholdsDTO;
  garanties: GarantieDTO[];
}
