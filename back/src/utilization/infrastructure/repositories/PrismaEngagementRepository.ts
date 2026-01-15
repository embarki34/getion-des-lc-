import { PrismaClient } from "../../../identity/infrastructure/persistence/prisma/client";
import { EngagementRepository } from "../../domain/repositories/EngagementRepository";
import { Engagement } from "../../domain/entities/Engagement";

export class PrismaEngagementRepository implements EngagementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(engagement: Engagement): Promise<void> {
    const props = engagement["props"];

    await this.prisma.engagement.upsert({
      where: { id: engagement.id },
      create: {
        id: engagement.id,
        ligneCreditId: props.ligneCreditId,
        typeFinancement: props.typeFinancement,
        montant: props.montant,
        devise: props.devise,
        dateEngagement: props.dateEngagement,
        dateEcheance: props.dateEcheance,
        statut: props.statut,
        referenceDossier: props.referenceDossier,
      },
      update: {
        statut: props.statut,
        montant: props.montant,
      },
    });
  }

  async findById(id: string): Promise<Engagement | null> {
    const record = await this.prisma.engagement.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByLigneCreditId(ligneId: string): Promise<Engagement[]> {
    const records = await this.prisma.engagement.findMany({
      where: { ligneCreditId: ligneId },
    });

    return records.map((r) => this.toDomain(r));
  }

  async sumEncoursByLigneId(ligneId: string): Promise<number> {
    const result = await this.prisma.engagement.aggregate({
      where: {
        ligneCreditId: ligneId,
        statut: "EN_COURS",
      },
      _sum: {
        montant: true,
      },
    });

    return result._sum.montant || 0;
  }

  private toDomain(record: any): Engagement {
    return Engagement.create(
      {
        ligneCreditId: record.ligneCreditId,
        typeFinancement: record.typeFinancement,
        montant: record.montant,
        devise: record.devise,
        dateEngagement: record.dateEngagement,
        dateEcheance: record.dateEcheance,
        statut: record.statut,
        referenceDossier: record.referenceDossier,
      },
      record.id
    );
  }
}
