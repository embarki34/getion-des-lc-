export interface IRolePermissionRepository {
  assignPermissionToRole(roleId: string, permissionId: string): Promise<void>;
  removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
  findPermissionsByRoleId(roleId: string): Promise<string[]>; // Returns permission IDs
  findRolesByPermissionId(permissionId: string): Promise<string[]>; // Returns role IDs
  hasPermission(roleId: string, permissionId: string): Promise<boolean>;
}

