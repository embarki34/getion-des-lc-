import { AggregateRoot } from "../../../shared/domain/ddd";

export interface RoleProps {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  permissions?: { id: string; code: string; name: string; description?: string; resource: string; action: string; scope: string; }[];
}

export class Role extends AggregateRoot<RoleProps> {
  private constructor(props: RoleProps, id?: string) {
    super(props, id);
  }

  public static create(props: RoleProps, id?: string): Role {
    if (!props.name || !props.code) {
      throw new Error("Role name and code are required");
    }

    if (props.code.length < 2) {
      throw new Error("Role code must be at least 2 characters");
    }

    return new Role(
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

  get isActive(): boolean {
    return this.props.isActive;
  }

  get permissions(): { id: string; code: string; name: string; description?: string; resource: string; action: string; scope: string; }[] | undefined {
    return this.props.permissions;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Role name cannot be empty");
    }
    this.props.name = name;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public updatePermissions(permissions: { id: string; code: string; name: string; resource: string; action: string; scope: string; }[]): void {
    this.props.permissions = permissions;
  }
}

