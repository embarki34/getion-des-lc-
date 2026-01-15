import { AggregateRoot } from '../../../shared/domain/ddd';
import { BankAccount } from './BankAccount';

export interface BanqueProps {
  nom: string;
  codeSwift: string;
  codeGuichet?: string; // Branch code
  establishment: string;
  bankAccounts: BankAccount[];
  adresse: string;
  contactInfo?: string;
  // TODO: Add audit fields if needed (createdAt, etc), assuming simple for now
}

export class Banque extends AggregateRoot<BanqueProps> {
  private constructor(props: BanqueProps, id?: string) {
    super(props, id);
  }

  public static create(props: BanqueProps, id?: string): Banque {
    this.validate(props);
    return new Banque(props, id);
  }

  private static validate(props: BanqueProps): void {
    if (!props.nom || props.nom.trim().length === 0) {
      throw new Error('Banque Name is required');
    }
    // Simple BIC validation: 8 or 11 alphanumeric characters
    const bicRegex = /^[A-Z0-9]{8}([A-Z0-9]{3})?$/;
    if (!bicRegex.test(props.codeSwift)) {
      throw new Error('Invalid SWIFT Code (BIC). Must be 8 or 11 alphanumeric characters.');
    }
  }

  public addBankAccount(account: BankAccount): void {
    this.props.bankAccounts.push(account);
  }

  public updateBankAccount(updatedAccount: BankAccount): void {
    const index = this.props.bankAccounts.findIndex((acc) => acc.id === updatedAccount.id);
    if (index === -1) {
      throw new Error('Bank Account not found in this bank');
    }
    this.props.bankAccounts[index] = updatedAccount;
  }

  public removeBankAccount(accountId: string): void {
    const index = this.props.bankAccounts.findIndex((acc) => acc.id === accountId);
    if (index === -1) {
      throw new Error('Bank Account not found in this bank');
    }
    this.props.bankAccounts.splice(index, 1);
  }

  get nom(): string {
    return this.props.nom;
  }
  get codeSwift(): string {
    return this.props.codeSwift;
  }
  get codeGuichet(): string | undefined {
    return this.props.codeGuichet;
  }
  get establishment(): string {
    return this.props.establishment;
  }
  get adresse(): string {
    return this.props.adresse;
  }
  get contactInfo(): string | undefined {
    return this.props.contactInfo;
  }
  get bankAccounts(): BankAccount[] {
    return [...this.props.bankAccounts];
  }
}
