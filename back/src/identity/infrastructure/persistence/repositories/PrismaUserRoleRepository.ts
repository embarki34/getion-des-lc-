import { PrismaClient } from "../prisma/client";
import { IUserRoleRepository } from "../../../domain/repositories/IUserRoleRepository";

export class PrismaUserRoleRepository implements IUserRoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async assignRoleToUser(
    userId: string,
    roleId: string,
    companyId?: string,
    businessUnitId?: string,
    assignedBy?: string
  ): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
        companyId: companyId || null,
        businessUnitId: businessUnitId || null,
        assignedBy: assignedBy || null,
      },
    });
  }

  async removeRoleFromUser(
    userId: string,
    roleId: string,
    companyId?: string,
    businessUnitId?: string
  ): Promise<void> {
    const where: any = {
      userId,
      roleId,
    };

    if (companyId !== undefined) {
      where.companyId = companyId || null;
    }
    if (businessUnitId !== undefined) {
      where.businessUnitId = businessUnitId || null;
    }

    await this.prisma.userRole.deleteMany({ where });
  }

  async findRolesByUserId(
    userId: string,
    companyId?: string,
    businessUnitId?: string
  ): Promise<string[]> {
    const where: any = { userId };

    if (companyId !== undefined) {
      where.companyId = companyId || null;
    }
    if (businessUnitId !== undefined) {
      where.businessUnitId = businessUnitId || null;
    }

    const records = await this.prisma.userRole.findMany({
      where,
      select: { roleId: true },
    });

    return records.map((r) => r.roleId);
  }

  async findUsersByRoleId(roleId: string): Promise<string[]> {
    const records = await this.prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });
    return records.map((r) => r.userId);
  }

  async hasRole(
    userId: string,
    roleId: string,
    companyId?: string,
    businessUnitId?: string
  ): Promise<boolean> {
    const where: any = {
      userId,
      roleId,
    };

    if (companyId !== undefined) {
      where.companyId = companyId || null;
    }
    if (businessUnitId !== undefined) {
      where.businessUnitId = businessUnitId || null;
    }

    const count = await this.prisma.userRole.count({ where });
    return count > 0;
  }
}

