import { PrismaClient } from "../prisma/client";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { Role } from "../../../domain/entities/Role";

export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(role: Role): Promise<void> {
    const props = role['props'];

    await this.prisma.role.upsert({
      where: { id: role.id },
      create: {
        id: role.id,
        name: props.name,
        code: props.code,
        description: props.description,
        isActive: props.isActive,
        rolePermissions: props.permissions ? {
          create: props.permissions.map((p: any) => ({ permissionId: p.id }))
        } : undefined
      },
      update: {
        name: props.name,
        code: props.code,
        description: props.description,
        isActive: props.isActive,
        rolePermissions: props.permissions ? {
          deleteMany: {},
          create: props.permissions.map((p: any) => ({ permissionId: p.id }))
        } : undefined
      },
    });
  }

  async findById(id: string): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByCode(code: string): Promise<Role | null> {
    const record = await this.prisma.role.findUnique({
      where: { code },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<Role[]> {
    const records = await this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });
    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  private toDomain(record: any): Role {
    return Role.create(
      {
        name: record.name,
        code: record.code,
        description: record.description ?? undefined,
        isActive: record.isActive,
        permissions: record['rolePermissions']?.map((rp: any) => ({
          id: rp.permission.id,
          code: rp.permission.code,
          name: rp.permission.name,
          description: rp.permission.description,
          resource: rp.permission.resource,
          action: rp.permission.action,
          scope: rp.permission.scope
        })) || []
      },
      record.id
    );
  }
}

