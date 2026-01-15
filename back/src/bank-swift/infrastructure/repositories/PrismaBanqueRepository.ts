import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { Banque } from '../../domain/entities/Banque';
import { BankAccount } from '../../domain/entities/BankAccount';

export class PrismaBanqueRepository implements BanqueRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(banque: Banque): Promise<void> {
    const props = banque['props'];

    // Upsert Banque
    await this.prisma.banque.upsert({
      where: { id: banque.id },
      create: {
        id: banque.id,
        nom: props.nom,
        codeSwift: props.codeSwift,
        codeGuichet: props.codeGuichet,
        establishment: props.establishment,
        adresse: props.adresse,
        contactInfo: props.contactInfo,
        bankAccounts: {
          create: props.bankAccounts.map((acc: any) => {
            const accProps = acc.props || acc; // Handle both entity and plain object
            return {
              id: acc.id,
              accountNumber: accProps.accountNumber,
              keyAccount: accProps.keyAccount,
              currency: accProps.currency,
              rib: accProps.rib,
              isActive: accProps.isActive,
              createdAt: accProps.createdAt,
              updatedAt: accProps.updatedAt,
              deletedAt: accProps.deletedAt,
              createdBy: accProps.createdBy,
              updatedBy: accProps.updatedBy,
              deletedBy: accProps.deletedBy,
            };
          }),
        },
      },
      update: {
        nom: props.nom,
        codeSwift: props.codeSwift,
        codeGuichet: props.codeGuichet,
        establishment: props.establishment,
        adresse: props.adresse,

        contactInfo: props.contactInfo,
        bankAccounts: {
          deleteMany: {
            id: {
              notIn: props.bankAccounts.map((acc: any) => acc.id),
            },
          },
          upsert: props.bankAccounts.map((acc: any) => {
            const accProps = acc.props || acc;
            return {
              where: { id: acc.id },
              create: {
                id: acc.id,
                accountNumber: accProps.accountNumber,
                keyAccount: accProps.keyAccount,
                currency: accProps.currency,
                rib: accProps.rib,
                isActive: accProps.isActive ?? true,
                createdAt: accProps.createdAt || new Date(),
                updatedAt: accProps.updatedAt || new Date(),
                createdBy: accProps.createdBy || 'system',
                updatedBy: accProps.updatedBy || 'system',
              },
              update: {
                accountNumber: accProps.accountNumber,
                keyAccount: accProps.keyAccount,
                currency: accProps.currency,
                rib: accProps.rib,
                isActive: accProps.isActive,
                updatedAt: new Date(),
                updatedBy: accProps.updatedBy || 'system',
              },
            };
          }),
        },
      },
    });
  }

  async findById(id: string): Promise<Banque | null> {
    const record = await this.prisma.banque.findUnique({
      where: { id },
      include: { bankAccounts: true },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<Banque[]> {
    const records = await this.prisma.banque.findMany({
      include: { bankAccounts: true },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findBySwiftCode(code: string): Promise<Banque | null> {
    const record = await this.prisma.banque.findUnique({
      where: { codeSwift: code },
      include: { bankAccounts: true },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banque.delete({
      where: { id },
    });
  }

  async countRelatedEntities(id: string): Promise<{ accounts: number; creditLines: number }> {
    const accounts = await this.prisma.bankAccount.count({
      where: { banqueId: id },
    });
    const creditLines = await this.prisma.ligneCredit.count({
      where: { banqueId: id },
    });

    return { accounts, creditLines };
  }

  private toDomain(record: any): Banque {
    const bankAccounts = (record.bankAccounts || []).map((acc: any) =>
      BankAccount.create({
        id: acc.id,
        accountNumber: acc.accountNumber,
        keyAccount: acc.keyAccount,
        currency: acc.currency,
        rib: acc.rib,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
        deletedAt: acc.deletedAt,
        isActive: acc.isActive,
        createdBy: acc.createdBy,
        updatedBy: acc.updatedBy,
        deletedBy: acc.deletedBy,
      })
    );

    return Banque.create(
      {
        nom: record.nom,
        codeSwift: record.codeSwift,
        codeGuichet: record.codeGuichet,
        establishment: record.establishment || '', // Handle potential null from DB
        adresse: record.adresse,
        contactInfo: record.contactInfo,
        bankAccounts: bankAccounts,
      },
      record.id
    );
  }
}
