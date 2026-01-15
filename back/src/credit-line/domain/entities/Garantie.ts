import { Entity } from '../../../shared/domain/ddd';

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
}
