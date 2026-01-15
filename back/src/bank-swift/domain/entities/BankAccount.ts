import { AggregateRoot } from '../../../shared/domain/ddd';

export interface BankAccountProps {
  id: string;
  accountNumber: string;
  keyAccount: string;
  currency: string;
  rib?: string; // Relevé d'Identité Bancaire
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  deletedBy: string | null;
}

export class BankAccount extends AggregateRoot<BankAccountProps> {
  private constructor(props: BankAccountProps) {
    super(props);
  }

  public static create(props: BankAccountProps): BankAccount {
    this.validate(props);
    return new BankAccount(props);
  }

  /**
   * Validates the account properties.
   * Throws an error if validation fails.
   */
  private static validate(props: BankAccountProps): void {
    const { accountNumber, keyAccount } = props;

    // Validate Account Number: numeric, 8-34 chars
    if (!/^\d{8,34}$/.test(accountNumber)) {
      throw new Error('Invalid Account Number: Must be numeric and between 8 and 34 characters.');
    }

    // // Validate Key Account: alphanumeric, 3-12 chars
    // if (!/^[a-zA-Z0-9]{3,12}$/.test(keyAccount)) {
    //   throw new Error('Invalid Key Account: Must be alphanumeric and between 3 and 12 characters.');
    // }
  }

  /**
   * Returns a new BankAccount instance with updated identity fields.
   * Updates updatedAt and updatedBy automatically.
   */
  public updatedIdentity(
    updatedBy: string,
    newAccountNumber?: string,
    newKeyAccount?: string
  ): BankAccount {
    const currentProps = this.props;

    const newProps: BankAccountProps = {
      ...currentProps,
      accountNumber: newAccountNumber ?? currentProps.accountNumber,
      keyAccount: newKeyAccount ?? currentProps.keyAccount,
      updatedBy: updatedBy,
      updatedAt: new Date(),
    };

    // This will trigger validation in the create method
    return BankAccount.create(newProps);
  }

  public updateDetails(
    updatedBy: string,
    details: Partial<Pick<BankAccountProps, 'accountNumber' | 'keyAccount' | 'currency' | 'rib' | 'isActive'>>
  ): BankAccount {
    const currentProps = this.props;
    const newProps: BankAccountProps = {
      ...currentProps,
      ...details,
      updatedBy: updatedBy,
      updatedAt: new Date(),
    };
    return BankAccount.create(newProps);
  }

  /**
   * Computes the normalized SWIFT-style identifier.
   * Format: KEY + ACCOUNT (Uppercased and Trimmed)
   */
  public get swiftIdentifier(): string {
    const raw = `${this.props.keyAccount}${this.props.accountNumber}`;
    return raw.trim().toUpperCase();
  }

  /**
   * Checks if the combined Swift Identifier is valid.
   */
  public isValidSwiftIdentifier(): boolean {
    try {
      BankAccount.validate(this.props);
      return true;
    } catch {
      return false;
    }
  }

  // Getters for properties
  get id(): string {
    return this.props.id;
  }
  get accountNumber(): string {
    return this.props.accountNumber;
  }
  get keyAccount(): string {
    return this.props.keyAccount;
  }
  get currency(): string {
    return this.props.currency;
  }
  get rib(): string | undefined {
    return this.props.rib;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }
  get deletedBy(): string | null {
    return this.props.deletedBy;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }
  get updatedBy(): string {
    return this.props.updatedBy;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
}
