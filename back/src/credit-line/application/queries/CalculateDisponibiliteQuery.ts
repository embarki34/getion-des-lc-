import { IQuery, IQueryHandler } from "../../../shared/application/IQuery";
import { LigneDeCreditRepository } from "../../domain/repositories/LigneDeCreditRepository";
import { EngagementRepository } from "../../../utilization/domain/repositories/EngagementRepository";

export interface DisponibiliteResult {
  ligneCreditId: string;
  plafond: number;
  encours: number;
  disponibilite: number;
  devise: string;
}

export class CalculateDisponibiliteQuery
  implements IQuery<DisponibiliteResult>
{
  constructor(public readonly ligneCreditId: string) {}
}

export class CalculateDisponibiliteQueryHandler
  implements IQueryHandler<CalculateDisponibiliteQuery, DisponibiliteResult>
{
  constructor(
    private readonly ligneCreditRepo: LigneDeCreditRepository,
    private readonly engagementRepo: EngagementRepository
  ) {}

  async execute(
    query: CalculateDisponibiliteQuery
  ): Promise<DisponibiliteResult> {
    const ligne = await this.ligneCreditRepo.findById(query.ligneCreditId);
    if (!ligne) {
      throw new Error(`Credit line not found: ${query.ligneCreditId}`);
    }

    const encours = await this.engagementRepo.sumEncoursByLigneId(
      query.ligneCreditId
    );
    const disponibilite = ligne.montantPlafond - encours;

    return {
      ligneCreditId: ligne.id,
      plafond: ligne.montantPlafond,
      encours,
      disponibilite,
      devise: ligne.devise,
    };
  }
}
