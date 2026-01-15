import { AggregateRoot } from '../../../shared/domain/ddd';
import { Garantie } from './Garantie';

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
}

export interface LigneDeCreditProps {
  no: string;
  description?: string;
  banqueId: string;
  autorisationNo: string;
  bankAccountNo: string;

  // Financials
  montantPlafond: number;
  montantDevise: string;
  taux: number;
  commitmentCommissionRate: number;

  // Status Tracking
  estimatedOutstanding: number;
  consumption: number;
  outstanding: number;

  // Dates
  startDate: Date;
  expiryDate: Date;
  renewalDate?: Date;

  // State
  statut: 'OUVERT' | 'CLOTURE' | 'SUSPENDU' | 'EXPÉDIÉ' | 'UTILISÉ';
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

  garanties: Garantie[];
}

export class LigneDeCredit extends AggregateRoot<LigneDeCreditProps> {
  private constructor(props: LigneDeCreditProps, id?: string) {
    super(props, id);
  }

  public static create(props: LigneDeCreditProps, id?: string): LigneDeCredit {
    if (props.expiryDate <= props.startDate) {
      throw new Error('Expiry date must be after start date');
    }
    if (props.montantPlafond < 0) {
      throw new Error('Plafond must be positive');
    }
    return new LigneDeCredit(props, id);
  }

  // Getters
  get no(): string {
    return this.props.no;
  }
  get banqueId(): string {
    return this.props.banqueId;
  }
  get montantPlafond(): number {
    return this.props.montantPlafond;
  }
  get devise(): string {
    return this.props.montantDevise;
  }
  get statut(): string {
    return this.props.statut;
  }
  get garanties(): Garantie[] {
    return [...this.props.garanties];
  }
  get thresholds(): Thresholds {
    return { ...this.props.thresholds };
  }

  public addGarantie(garantie: Garantie): void {
    this.props.garanties.push(garantie);
  }

  public updateConsumption(amount: number): void {
    this.props.consumption = amount;
    this.props.outstanding = this.props.montantPlafond - this.props.consumption;
  }
}
