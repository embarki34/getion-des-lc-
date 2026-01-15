import { AggregateRoot } from "../../../shared/domain/ddd";

export interface CompanyProps {
  name: string;
  code: string;
  description?: string;
  address?: string;
  contactInfo?: string;
  parentCompanyId?: string;
  isActive: boolean;
}

export class Company extends AggregateRoot<CompanyProps> {
  private constructor(props: CompanyProps, id?: string) {
    super(props, id);
  }

  public static create(props: CompanyProps, id?: string): Company {
    // Validation
    if (!props.name || !props.code) {
      throw new Error("Company name and code are required");
    }

    if (props.code.length < 2) {
      throw new Error("Company code must be at least 2 characters");
    }

    return new Company(
      {
        ...props,
        isActive: props.isActive !== undefined ? props.isActive : true,
      },
      id
    );
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get contactInfo(): string | undefined {
    return this.props.contactInfo;
  }

  get parentCompanyId(): string | undefined {
    return this.props.parentCompanyId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Company name cannot be empty");
    }
    this.props.name = name;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }

  public updateAddress(address?: string): void {
    this.props.address = address;
  }

  public updateContactInfo(contactInfo?: string): void {
    this.props.contactInfo = contactInfo;
  }

  public setParentCompany(parentCompanyId: string | undefined): void {
    // Prevent self-reference
    if (parentCompanyId === this.id) {
      throw new Error("Company cannot be its own parent");
    }
    this.props.parentCompanyId = parentCompanyId;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public isBranch(): boolean {
    return !!this.props.parentCompanyId;
  }
}

