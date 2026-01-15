import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { Company } from '../../domain/entities/Company';

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(company: Company): Promise<void> {
    const props = company['props'];

    await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: props.name,
        code: props.code,
        description: props.description,
        address: props.address,
        contactInfo: props.contactInfo,
        parentCompanyId: props.parentCompanyId,
        isActive: props.isActive,
      },
      update: {
        name: props.name,
        code: props.code,
        description: props.description,
        address: props.address,
        contactInfo: props.contactInfo,
        parentCompanyId: props.parentCompanyId,
        isActive: props.isActive,
      },
    });
  }

  async findById(id: string): Promise<Company | null> {
    const record = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByCode(code: string): Promise<Company | null> {
    const record = await this.prisma.company.findUnique({
      where: { code },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<Company[]> {
    const records = await this.prisma.company.findMany();
    return records.map((r) => this.toDomain(r));
  }

  async findByParentCompanyId(parentCompanyId: string): Promise<Company[]> {
    const records = await this.prisma.company.findMany({
      where: { parentCompanyId },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findRootCompanies(): Promise<Company[]> {
    const records = await this.prisma.company.findMany({
      where: { parentCompanyId: null },
    });
    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }

  private toDomain(record: any): Company {
    return Company.create(
      {
        name: record.name,
        code: record.code,
        description: record.description ?? undefined,
        address: record.address ?? undefined,
        contactInfo: record.contactInfo ?? undefined,
        parentCompanyId: record.parentCompanyId ?? undefined,
        isActive: record.isActive,
      },
      record.id
    );
  }
}

