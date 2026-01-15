import { AggregateRoot } from "../../../shared/domain/ddd";

export interface EngagementProps {
  ligneCreditId: string;
  typeFinancement: string; // LC, CMT, etc.
  montant: number;
  devise: string;
  dateEngagement: Date;
  dateEcheance: Date;
  statut: "EN_COURS" | "REGLE" | "ANNULE";
  referenceDossier: string; // e.g., LC Number
}

export class Engagement extends AggregateRoot<EngagementProps> {
  private constructor(props: EngagementProps, id?: string) {
    super(props, id);
  }

  public static create(props: EngagementProps, id?: string): Engagement {
    return new Engagement(props, id);
  }

  get montant(): number {
    return this.props.montant;
  }
  get statut(): string {
    return this.props.statut;
  }

  public regler(): void {
    this.props.statut = "REGLE";
  }
}
