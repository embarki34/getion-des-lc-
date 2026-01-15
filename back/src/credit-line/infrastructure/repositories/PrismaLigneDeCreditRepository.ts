import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { LigneDeCredit } from '../../domain/entities/LigneDeCredit';
import { Garantie } from '../../domain/entities/Garantie';

export class PrismaLigneDeCreditRepository implements LigneDeCreditRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(ligne: LigneDeCredit): Promise<void> {
    const props = ligne['props'];

    // Convert Entity Props to Prisma Data Structure
    const data = {
      id: ligne.id,
      no: props.no,
      description: props.description,
      banqueId: props.banqueId,
      autorisationNo: props.autorisationNo,
      bankAccountNo: props.bankAccountNo,
      montantPlafond: props.montantPlafond,
      montantDevise: props.montantDevise,
      taux: props.taux,
      commitmentCommissionRate: props.commitmentCommissionRate,
      estimatedOutstanding: props.estimatedOutstanding,
      consumption: props.consumption,
      outstanding: props.outstanding,
      startDate: props.startDate,
      expiryDate: props.expiryDate,
      renewalDate: props.renewalDate,
      statut: props.statut,
      responsibilityCenter: props.responsibilityCenter,
      typeFinancement: props.typeFinancement,
      maxConsumptionTolerance: props.maxConsumptionTolerance,
      minConsumptionTolerance: props.minConsumptionTolerance,
      noSeries: props.noSeries,
      refinancing: props.refinancing,

      // Thresholds (Seuils)
      seuilAvanceSurStock: props.thresholds.seuilAvanceSurStock,
      seuilAvanceSurFacture: props.thresholds.seuilAvanceSurFacture,
      seuilEscompte: props.thresholds.seuilEscompte,
      seuilLC: props.thresholds.seuilLC,
      seuilObligtDouane: props.thresholds.seuilObligtDouane,
      seuilCautionAdmin: props.thresholds.seuilCautionAdmin,
      seuilDcvrtMobile: props.thresholds.seuilDcvrtMobile,
      seuilTrsfrLibre: props.thresholds.seuilTrsfrLibre,
      seuilLeasing: props.thresholds.seuilLeasing,
      seuilCMT: props.thresholds.seuilCMT,
      seuilFraisMission: props.thresholds.seuilFraisMission,
      seuilLCAS: props.thresholds.seuilLCAS,

      // Consumption Breakdown
      avanceSurStock: props.consumptionBreakdown.avanceSurStock,
      avanceFacture: props.consumptionBreakdown.avanceFacture,
      escompte: props.consumptionBreakdown.escompte,
      obligatDouane: props.consumptionBreakdown.obligatDouane,
      cautionAdmin: props.consumptionBreakdown.cautionAdmin,
      dcvrtMobile: props.consumptionBreakdown.dcvrtMobile,
      trsfrLibre: props.consumptionBreakdown.trsfrLibre,
      leasing: props.consumptionBreakdown.leasing,
      CMT: props.consumptionBreakdown.CMT,
      fraisMission: props.consumptionBreakdown.fraisMission,
      LCAS: props.consumptionBreakdown.LCAS,
      faciliteCaissier: props.consumptionBreakdown.faciliteCaissier,
    };

    const garantiesData = props.garanties.map((g: Garantie) => ({
      id: g.id,
      type: g.type,
      montant: g.montant,
      dateExpiration: g.dateExpiration,
      description: g.description,
    }));

    await this.prisma.ligneCredit.upsert({
      where: { id: ligne.id },
      create: {
        ...data,
        garanties: {
          create: garantiesData,
        },
      },
      update: {
        ...data,
        garanties: {
          deleteMany: {},
          create: garantiesData,
        },
      },
    });
  }

  async findById(id: string): Promise<LigneDeCredit | null> {
    const record = await this.prisma.ligneCredit.findUnique({
      where: { id },
      include: { garanties: true },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findAll(): Promise<LigneDeCredit[]> {
    const records = await this.prisma.ligneCredit.findMany({
      include: { garanties: true },
    });

    return records.map((r) => this.toDomain(r));
  }

  async findAllGuarantees(): Promise<any[]> {
    // @ts-ignore
    const guarantees = await this.prisma.garantie.findMany({
      include: {
        ligneCredit: true // Include parent credit line info
      }
    });

    return guarantees;
  }

  async findByBanqueId(banqueId: string): Promise<LigneDeCredit[]> {
    const records = await this.prisma.ligneCredit.findMany({
      where: { banqueId },
      include: { garanties: true },
    });

    return records.map((r) => this.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ligneCredit.delete({
      where: { id },
    });
  }

  async update(ligne: LigneDeCredit): Promise<void> {
    await this.save(ligne);
  }

  async countRelatedEntities(id: string): Promise<{ engagements: number }> {
    const engagements = await this.prisma.engagement.count({
      where: { ligneCreditId: id },
    });

    return { engagements };
  }

  private toDomain(record: any): LigneDeCredit {
    const garanties = record.garanties.map((g: any) =>
      Garantie.create(
        {
          type: g.type,
          montant: g.montant,
          dateExpiration: g.dateExpiration,
          description: g.description,
        },
        g.id
      )
    );

    return LigneDeCredit.create(
      {
        no: record.no,
        description: record.description,
        banqueId: record.banqueId,
        autorisationNo: record.autorisationNo,
        bankAccountNo: record.bankAccountNo,
        montantPlafond: record.montantPlafond,
        montantDevise: record.montantDevise,
        taux: record.taux,
        commitmentCommissionRate: record.commitmentCommissionRate,
        estimatedOutstanding: record.estimatedOutstanding,
        consumption: record.consumption,
        outstanding: record.outstanding,
        startDate: record.startDate,
        expiryDate: record.expiryDate,
        renewalDate: record.renewalDate,
        statut: record.statut as any,
        responsibilityCenter: record.responsibilityCenter,
        typeFinancement: record.typeFinancement,
        maxConsumptionTolerance: record.maxConsumptionTolerance,
        minConsumptionTolerance: record.minConsumptionTolerance,
        noSeries: record.noSeries,
        refinancing: record.refinancing,

        thresholds: {
          seuilAvanceSurStock: record.seuilAvanceSurStock,
          seuilAvanceSurFacture: record.seuilAvanceSurFacture,
          seuilEscompte: record.seuilEscompte,
          seuilLC: record.seuilLC,
          seuilObligtDouane: record.seuilObligtDouane,
          seuilCautionAdmin: record.seuilCautionAdmin,
          seuilDcvrtMobile: record.seuilDcvrtMobile,
          seuilTrsfrLibre: record.seuilTrsfrLibre,
          seuilLeasing: record.seuilLeasing,
          seuilCMT: record.seuilCMT,
          seuilFraisMission: record.seuilFraisMission,
          seuilLCAS: record.seuilLCAS,
        },
        consumptionBreakdown: {
          avanceSurStock: record.avanceSurStock,
          avanceFacture: record.avanceFacture,
          escompte: record.escompte,
          obligatDouane: record.obligatDouane,
          cautionAdmin: record.cautionAdmin,
          dcvrtMobile: record.dcvrtMobile,
          trsfrLibre: record.trsfrLibre,
          leasing: record.leasing,
          CMT: record.CMT,
          fraisMission: record.fraisMission,
          LCAS: record.LCAS,
          faciliteCaissier: record.faciliteCaissier,
        },
        garanties: garanties,
      },
      record.id
    );
  }
}
