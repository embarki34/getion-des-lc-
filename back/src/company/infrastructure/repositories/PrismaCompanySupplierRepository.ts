import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { CompanySupplierRepository } from '../../domain/repositories/CompanySupplierRepository';

export class PrismaCompanySupplierRepository implements CompanySupplierRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async assignSupplierToCompany(companyId: string, supplierId: string): Promise<void> {
    await this.prisma.companySupplier.create({
      data: {
        companyId,
        supplierId,
      },
    });
  }

  async removeSupplierFromCompany(companyId: string, supplierId: string): Promise<void> {
    await this.prisma.companySupplier.deleteMany({
      where: {
        companyId,
        supplierId,
      },
    });
  }

  async findSuppliersByCompanyId(companyId: string): Promise<string[]> {
    const records = await this.prisma.companySupplier.findMany({
      where: { companyId },
      select: { supplierId: true },
    });
    return records.map((r) => r.supplierId);
  }

  async findCompaniesBySupplierId(supplierId: string): Promise<string[]> {
    const records = await this.prisma.companySupplier.findMany({
      where: { supplierId },
      select: { companyId: true },
    });
    return records.map((r) => r.companyId);
  }

  async isSupplierAssignedToCompany(companyId: string, supplierId: string): Promise<boolean> {
    const record = await this.prisma.companySupplier.findUnique({
      where: {
        companyId_supplierId: {
          companyId,
          supplierId,
        },
      },
    });
    return !!record;
  }
}

