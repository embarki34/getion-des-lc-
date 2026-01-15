import { PrismaClient } from "../prisma/client";
import { IRolePermissionRepository } from "../../../domain/repositories/IRolePermissionRepository";

export class PrismaRolePermissionRepository implements IRolePermissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }

  async findPermissionsByRoleId(roleId: string): Promise<string[]> {
    const records = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });
    return records.map((r) => r.permissionId);
  }

  async findRolesByPermissionId(permissionId: string): Promise<string[]> {
    const records = await this.prisma.rolePermission.findMany({
      where: { permissionId },
      select: { roleId: true },
    });
    return records.map((r) => r.roleId);
  }

  async hasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const record = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
    return !!record;
  }
}

