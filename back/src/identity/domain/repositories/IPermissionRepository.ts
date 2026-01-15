import { Permission } from "../entities/Permission";

export interface IPermissionRepository {
  save(permission: Permission): Promise<void>;
  findById(id: string): Promise<Permission | null>;
  findByCode(code: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByResource(resource: string): Promise<Permission[]>;
  delete(id: string): Promise<void>;
}

