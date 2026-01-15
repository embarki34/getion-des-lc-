import { AggregateRoot } from '../../../shared/domain/ddd';

export enum SwiftMessageType {
  MT700 = 'MT700',
  MT707 = 'MT707',
  MT734 = 'MT734',
}

export interface SwiftMessageProps {
  type: SwiftMessageType;
  content: string; // The raw SWIFT message content
  referenceDossier: string; // LC Reference or similar
  dateGeneration: Date;
  statut: 'GENERATED' | 'SENT' | 'ACKNOWLEDGED';
}

export class SwiftMessage extends AggregateRoot<SwiftMessageProps> {
  private constructor(props: SwiftMessageProps, id?: string) {
    super(props, id);
  }

  public static create(props: SwiftMessageProps, id?: string): SwiftMessage {
    this.validate(props);
    return new SwiftMessage(props, id);
  }

  private static validate(props: SwiftMessageProps): void {
    if (!props.content || props.content.trim().length === 0) {
      throw new Error('Swift Message Content cannot be empty');
    }
    if (!props.referenceDossier) {
      throw new Error('Reference Dossier is required');
    }
  }

  get type(): SwiftMessageType {
    return this.props.type;
  }
  get content(): string {
    return this.props.content;
  }
  get referenceDossier(): string {
    return this.props.referenceDossier;
  }
  get dateGeneration(): Date {
    return this.props.dateGeneration;
  }
  get statut(): string {
    return this.props.statut;
  }

  public markAsSent(): void {
    this.props.statut = 'SENT';
  }
}
