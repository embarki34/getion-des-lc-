import { AggregateRoot } from "../../../shared/domain/ddd";

export interface BusinessUnitProps {
  name: string;
  code: string;
  description?: string;
  companyId: string;
  isActive: boolean;
}

export class BusinessUnit extends AggregateRoot<BusinessUnitProps> {
  private constructor(props: BusinessUnitProps, id?: string) {
    super(props, id);
  }

  public static create(props: BusinessUnitProps, id?: string): BusinessUnit {
    // Validation
    if (!props.name || !props.code) {
      throw new Error("Business unit name and code are required");
    }

    if (!props.companyId) {
      throw new Error("Business unit must belong to a company");
    }

    if (props.code.length < 2) {
      throw new Error("Business unit code must be at least 2 characters");
    }

    return new BusinessUnit(
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

  get companyId(): string {
    return this.props.companyId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Business unit name cannot be empty");
    }
    this.props.name = name;
  }

  public updateCode(code: string): void {
    if (!code || code.length < 2) {
      throw new Error("Business unit code must be at least 2 characters");
    }
    this.props.code = code;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }

  public changeCompany(companyId: string): void {
    if (!companyId) {
      throw new Error("Company ID is required");
    }
    this.props.companyId = companyId;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }
}

