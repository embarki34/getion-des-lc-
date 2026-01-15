import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { BusinessUnitRepository } from '../../domain/repositories/BusinessUnitRepository';
import { BusinessUnit } from '../../domain/entities/BusinessUnit';

export class PrismaBusinessUnitRepository implements BusinessUnitRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(businessUnit: BusinessUnit): Promise<void> {
    const props = businessUnit['props'];

    await this.prisma.businessUnit.upsert({
      where: { id: businessUnit.id },
      create: {
        id: businessUnit.id,
        name: props.name,
        code: props.code,
        description: props.description,
        companyId: props.companyId,
        isActive: props.isActive,
      },
      update: {
        name: props.name,
        code: props.code,
        description: props.description,
        companyId: props.companyId,
        isActive: props.isActive,
      },
    });
  }

  async findById(id: string): Promise<BusinessUnit | null> {
    const record = await this.prisma.businessUnit.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByCode(code: string, companyId: string): Promise<BusinessUnit | null> {
    const record = await this.prisma.businessUnit.findUnique({
      where: {
        code_companyId: {
          code,
          companyId,
        },
      },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<BusinessUnit[]> {
    const records = await this.prisma.businessUnit.findMany();
    return records.map((r) => this.toDomain(r));
  }

  async findByCompanyId(companyId: string): Promise<BusinessUnit[]> {
    const records = await this.prisma.businessUnit.findMany({
      where: { companyId },
    });
    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.businessUnit.delete({
      where: { id },
    });
  }

  private toDomain(record: any): BusinessUnit {
    return BusinessUnit.create(
      {
        name: record.name,
        code: record.code,
        description: record.description ?? undefined,
        companyId: record.companyId,
        isActive: record.isActive,
      },
      record.id
    );
  }
}

