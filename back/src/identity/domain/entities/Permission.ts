import { AggregateRoot } from "../../../shared/domain/ddd";

export type PermissionScope = "all" | "own" | "company" | "business-unit";

export interface PermissionProps {
  name: string;
  code: string;
  description?: string;
  resource: string; // e.g., 'user', 'company', 'credit-line'
  action: string; // e.g., 'read', 'write', 'delete'
  scope: PermissionScope;
}

export class Permission extends AggregateRoot<PermissionProps> {
  private constructor(props: PermissionProps, id?: string) {
    super(props, id);
  }

  public static create(props: PermissionProps, id?: string): Permission {
    if (!props.name || !props.code) {
      throw new Error("Permission name and code are required");
    }

    if (!props.resource || !props.action) {
      throw new Error("Permission resource and action are required");
    }

    if (props.code.length < 3) {
      throw new Error("Permission code must be at least 3 characters");
    }

    const validScopes: PermissionScope[] = ["all", "own", "company", "business-unit"];
    if (!validScopes.includes(props.scope)) {
      throw new Error(`Invalid permission scope. Must be one of: ${validScopes.join(", ")}`);
    }

    return new Permission(
      {
        ...props,
        scope: props.scope || "all",
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

  get resource(): string {
    return this.props.resource;
  }

  get action(): string {
    return this.props.action;
  }

  get scope(): PermissionScope {
    return this.props.scope;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Permission name cannot be empty");
    }
    this.props.name = name;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }

  public updateScope(scope: PermissionScope): void {
    const validScopes: PermissionScope[] = ["all", "own", "company", "business-unit"];
    if (!validScopes.includes(scope)) {
      throw new Error(`Invalid permission scope. Must be one of: ${validScopes.join(", ")}`);
    }
    this.props.scope = scope;
  }
}

