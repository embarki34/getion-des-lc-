import { AggregateRoot } from "../shared/ddd";
import { Garantie } from "./Garantie";

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
  [key: string]: number; // Index signature for dynamic access
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
  [key: string]: number; // Index signature for dynamic access
}

export type LigneDeCreditStatus =
  | "OUVERT"
  | "CLOTURE"
  | "SUSPENDU"
  | "EXPÉDIÉ"
  | "UTILISÉ";

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
  // "outstanding" in banking logic here = DETTE (Used Amount)
  // But strictly we should use clear terms.
  // props.consumption tracks the total used.
  consumption: number;

  // Dates
  startDate: Date;
  expiryDate: Date;
  renewalDate?: Date;

  // State
  statut: LigneDeCreditStatus;
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
      throw new Error(
        "La date d'expiration doit être postérieure à la date de début"
      );
    }
    if (props.montantPlafond < 0) {
      throw new Error("Le plafond doit être positif");
    }

    // Default initialization if missing
    if (!props.consumption) props.consumption = 0;
    if (!props.statut) props.statut = "OUVERT";
    if (!props.garanties) props.garanties = [];

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
  get statut(): LigneDeCreditStatus {
    return this.props.statut;
  }
  get consumption(): number {
    return this.props.consumption;
  }

  // Safe Getters matching Banking Terminology
  get outstandingAmount(): number {
    return this.props.consumption;
  }

  get availableAmount(): number {
    return this.props.montantPlafond - this.props.consumption;
  }

  get garanties(): Garantie[] {
    return [...this.props.garanties];
  }

  get thresholds(): Thresholds {
    return { ...this.props.thresholds };
  }

  get consumptionBreakdown(): ConsumptionBreakdown {
    return { ...this.props.consumptionBreakdown };
  }

  // --- BUSINESS LOGIC ---

  /**
   * Consumes an amount from the credit line for a specific financing type.
   * Enforces Global Ceiling and Specific Thresholds.
   */
  public consume(amount: number, type: keyof ConsumptionBreakdown): void {
    // 1. Guard Clauses (Status)
    if (this.props.statut === "CLOTURE" || this.props.statut === "SUSPENDU") {
      throw new Error(
        `Opération impossible: La ligne de crédit est ${this.props.statut}`
      );
    }

    if (amount <= 0) {
      throw new Error("Le montant de consommation doit être positif");
    }

    // 2. Check Global Ceiling (with Tolerance)
    const newConsumption = this.props.consumption + amount;
    const maxAllowed =
      this.props.montantPlafond + (this.props.maxConsumptionTolerance || 0);

    if (newConsumption > maxAllowed) {
      throw new Error(
        `Plafond global dépassé. Disponible: ${this.availableAmount}, Demandé: ${amount}`
      );
    }

    // 3. Check Specific Threshold (Seuil)
    // Map breakdown keys to threshold keys
    // Convention: key 'avanceSurStock' -> 'seuilAvanceSurStock'
    // We capitalise the first letter for the mapping
    const thresholdKey = `seuil${
      type.toString().charAt(0).toUpperCase() + type.toString().slice(1)
    }`;
    const threshold = this.props.thresholds[thresholdKey];

    const currentTypeConsumption = this.props.consumptionBreakdown[type] || 0;
    const newTypeConsumption = currentTypeConsumption + amount;

    if (threshold !== undefined && threshold > 0) {
      if (newTypeConsumption > threshold) {
        throw new Error(
          `Seuil spécifique dépassé pour ${String(
            type
          )}. Seuil: ${threshold}, Actuel: ${currentTypeConsumption}, Demandé: ${amount}`
        );
      }
    }

    // 4. Apply Update
    this.props.consumption = newConsumption;
    this.props.consumptionBreakdown[type] = newTypeConsumption;

    // 5. Update Status Transition
    if (this.props.statut === "OUVERT" && this.props.consumption > 0) {
      this.props.statut = "UTILISÉ";
    }
  }

  /**
   * Adds a guarantee to the credit line.
   * Checks for expiration validity relative to the credit line.
   */
  public addGarantie(garantie: Garantie): void {
    // Rule: Guarantee must not expire before the credit line itself (Strict Policy)
    // Or warn? For now we enforce strict checking as per "Banking S.I." requirements
    if (garantie.dateExpiration < this.props.expiryDate) {
      // In some banks this is allowed but reduces quality. Here we block for safety.
      throw new Error(
        `La garantie expire (${
          garantie.dateExpiration.toISOString().split("T")[0]
        }) avant la ligne de crédit (${
          this.props.expiryDate.toISOString().split("T")[0]
        })`
      );
    }

    this.props.garanties.push(garantie);
  }

  /**
   * Suspend the credit line manually.
   */
  public suspend(reason: string): void {
    if (this.props.statut === "CLOTURE") {
      throw new Error("Impossible de suspendre une ligne clôturée");
    }
    this.props.statut = "SUSPENDU";
    // Ideally we would log the reason in a Domain Event
    this.addDomainEvent({
      type: "CreditLineSuspended",
      reason,
      date: new Date(),
    });
  }

  public close(): void {
    if (this.props.consumption > 0) {
      // Banking Rule: Cannot close if there is outstanding debt?
      // Usually yes, unless it's written off. For now, we block.
      throw new Error(
        "Impossible de clôturer une ligne avec un encours positif (dette non remboursée)"
      );
    }
    this.props.statut = "CLOTURE";
  }
}
