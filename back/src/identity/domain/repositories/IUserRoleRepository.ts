export interface IUserRoleRepository {
  assignRoleToUser(
    userId: string,
    roleId: string,
    companyId?: string,
    businessUnitId?: string,
    assignedBy?: string
  ): Promise<void>;
  removeRoleFromUser(userId: string, roleId: string, companyId?: string, businessUnitId?: string): Promise<void>;
  findRolesByUserId(userId: string, companyId?: string, businessUnitId?: string): Promise<string[]>; // Returns role IDs
  findUsersByRoleId(roleId: string): Promise<string[]>; // Returns user IDs
  hasRole(userId: string, roleId: string, companyId?: string, businessUnitId?: string): Promise<boolean>;
}

