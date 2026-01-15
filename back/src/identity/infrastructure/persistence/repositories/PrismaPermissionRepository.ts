import { PrismaClient } from "../prisma/client";
import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { Permission } from "../../../domain/entities/Permission";

export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(permission: Permission): Promise<void> {
    const props = permission['props'];

    await this.prisma.permission.upsert({
      where: { id: permission.id },
      create: {
        id: permission.id,
        name: props.name,
        code: props.code,
        description: props.description,
        resource: props.resource,
        action: props.action,
        scope: props.scope,
      },
      update: {
        name: props.name,
        code: props.code,
        description: props.description,
        resource: props.resource,
        action: props.action,
        scope: props.scope,
      },
    });
  }

  async findById(id: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByCode(code: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({
      where: { code },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<Permission[]> {
    const records = await this.prisma.permission.findMany();
    return records.map((r) => this.toDomain(r));
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const records = await this.prisma.permission.findMany({
      where: { resource },
    });
    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }

  private toDomain(record: any): Permission {
    return Permission.create(
      {
        name: record.name,
        code: record.code,
        description: record.description ?? undefined,
        resource: record.resource,
        action: record.action,
        scope: record.scope as any,
      },
      record.id
    );
  }
}

