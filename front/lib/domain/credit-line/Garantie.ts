import { Entity } from "../shared/ddd";

export interface GarantieProps {
  type: string;
  montant: number;
  dateExpiration: Date;
  description?: string;
}

export class Garantie extends Entity<GarantieProps> {
  private constructor(props: GarantieProps, id?: string) {
    super(props, id);
  }

  public static create(props: GarantieProps, id?: string): Garantie {
    if (props.montant <= 0) {
      throw new Error("Le montant de la garantie doit être positif");
    }
    if (props.dateExpiration < new Date()) {
      throw new Error("La garantie ne peut pas être expirée à la création");
    }
    return new Garantie(props, id);
  }

  get type(): string {
    return this.props.type;
  }
  get montant(): number {
    return this.props.montant;
  }
  get dateExpiration(): Date {
    return this.props.dateExpiration;
  }
  get description(): string | undefined {
    return this.props.description;
  }

  public isValidAt(date: Date): boolean {
    return this.props.dateExpiration >= date;
  }
}
