import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { BusinessUnitSupplierRepository } from '../../domain/repositories/BusinessUnitSupplierRepository';

export class PrismaBusinessUnitSupplierRepository
  implements BusinessUnitSupplierRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async assignSupplierToBusinessUnit(
    businessUnitId: string,
    supplierId: string
  ): Promise<void> {
    await this.prisma.businessUnitSupplier.create({
      data: {
        businessUnitId,
        supplierId,
      },
    });
  }

  async removeSupplierFromBusinessUnit(
    businessUnitId: string,
    supplierId: string
  ): Promise<void> {
    await this.prisma.businessUnitSupplier.deleteMany({
      where: {
        businessUnitId,
        supplierId,
      },
    });
  }

  async findSuppliersByBusinessUnitId(businessUnitId: string): Promise<string[]> {
    const records = await this.prisma.businessUnitSupplier.findMany({
      where: { businessUnitId },
      select: { supplierId: true },
    });
    return records.map((r) => r.supplierId);
  }

  async findBusinessUnitsBySupplierId(supplierId: string): Promise<string[]> {
    const records = await this.prisma.businessUnitSupplier.findMany({
      where: { supplierId },
      select: { businessUnitId: true },
    });
    return records.map((r) => r.businessUnitId);
  }

  async isSupplierAssignedToBusinessUnit(
    businessUnitId: string,
    supplierId: string
  ): Promise<boolean> {
    const record = await this.prisma.businessUnitSupplier.findUnique({
      where: {
        businessUnitId_supplierId: {
          businessUnitId,
          supplierId,
        },
      },
    });
    return !!record;
  }
}

