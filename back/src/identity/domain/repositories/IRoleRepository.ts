import { Role } from "../entities/Role";

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  findById(id: string): Promise<Role | null>;
  findByCode(code: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  delete(id: string): Promise<void>;
}

