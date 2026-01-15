import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { Supplier } from '../../domain/entities/Supplier';

export class PrismaSupplierRepository implements SupplierRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(supplier: Supplier): Promise<void> {
    const props = supplier['props'];

    await this.prisma.supplier.upsert({
      where: { id: supplier.id },
      create: {
        id: supplier.id,
        name: props.name,
        code: props.code,
        description: props.description,
        contactInfo: props.contactInfo,
        address: props.address,
        isActive: props.isActive,
      },
      update: {
        name: props.name,
        code: props.code,
        description: props.description,
        contactInfo: props.contactInfo,
        address: props.address,
        isActive: props.isActive,
      },
    });
  }

  async findById(id: string): Promise<Supplier | null> {
    const record = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByCode(code: string): Promise<Supplier | null> {
    const record = await this.prisma.supplier.findUnique({
      where: { code },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<Supplier[]> {
    const records = await this.prisma.supplier.findMany();
    return records.map((r) => this.toDomain(r));
  }

  async findByBusinessUnitId(businessUnitId: string): Promise<Supplier[]> {
    const records = await this.prisma.supplier.findMany({
      where: {
        businessUnitSuppliers: {
          some: {
            businessUnitId,
          },
        },
      },
    });
    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.delete({
      where: { id },
    });
  }

  private toDomain(record: any): Supplier {
    return Supplier.create(
      {
        name: record.name,
        code: record.code,
        description: record.description ?? undefined,
        contactInfo: record.contactInfo ?? undefined,
        address: record.address ?? undefined,
        isActive: record.isActive,
      },
      record.id
    );
  }
}

