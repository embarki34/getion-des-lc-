import { AggregateRoot } from "../../../shared/domain/ddd";

export interface SupplierProps {
  name: string;
  code: string;
  description?: string;
  contactInfo?: string;
  address?: string;
  isActive: boolean;
}

export class Supplier extends AggregateRoot<SupplierProps> {
  private constructor(props: SupplierProps, id?: string) {
    super(props, id);
  }

  public static create(props: SupplierProps, id?: string): Supplier {
    // Validation
    if (!props.name || !props.code) {
      throw new Error("Supplier name and code are required");
    }

    if (props.code.length < 2) {
      throw new Error("Supplier code must be at least 2 characters");
    }

    return new Supplier(
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

  get contactInfo(): string | undefined {
    return this.props.contactInfo;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Supplier name cannot be empty");
    }
    this.props.name = name;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }

  public updateContactInfo(contactInfo?: string): void {
    this.props.contactInfo = contactInfo;
  }

  public updateAddress(address?: string): void {
    this.props.address = address;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }
}

