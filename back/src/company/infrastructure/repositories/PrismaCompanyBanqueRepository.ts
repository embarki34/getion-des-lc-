import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { CompanyBanqueRepository } from '../../domain/repositories/CompanyBanqueRepository';

export class PrismaCompanyBanqueRepository implements CompanyBanqueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async assignBanqueToCompany(companyId: string, banqueId: string): Promise<void> {
    await this.prisma.companyBanque.create({
      data: {
        companyId,
        banqueId,
      },
    });
  }

  async removeBanqueFromCompany(companyId: string, banqueId: string): Promise<void> {
    await this.prisma.companyBanque.deleteMany({
      where: {
        companyId,
        banqueId,
      },
    });
  }

  async findBanquesByCompanyId(companyId: string): Promise<string[]> {
    const records = await this.prisma.companyBanque.findMany({
      where: { companyId },
      select: { banqueId: true },
    });
    return records.map((r) => r.banqueId);
  }

  async findCompaniesByBanqueId(banqueId: string): Promise<string[]> {
    const records = await this.prisma.companyBanque.findMany({
      where: { banqueId },
      select: { companyId: true },
    });
    return records.map((r) => r.companyId);
  }

  async isBanqueAssignedToCompany(companyId: string, banqueId: string): Promise<boolean> {
    const record = await this.prisma.companyBanque.findUnique({
      where: {
        companyId_banqueId: {
          companyId,
          banqueId,
        },
      },
    });
    return !!record;
  }
}

