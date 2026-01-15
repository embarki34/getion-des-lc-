import { IQuery, IQueryHandler } from "../../../shared/application/IQuery";
import { KPIService } from "../../domain/services/KPIService";

export interface AmortissementCMTResult {
  montant: number;
  tauxAnnuel: number;
  nbMois: number;
  table: Array<{
    mois: number;
    capital: number;
    interet: number;
    mensualite: number;
    capitalRestant: number;
  }>;
}

export class CalculateAmortissementCMTQuery
  implements IQuery<AmortissementCMTResult>
{
  constructor(
    public readonly montant: number,
    public readonly tauxAnnuel: number,
    public readonly nbMois: number
  ) {}
}

export class CalculateAmortissementCMTQueryHandler
  implements
    IQueryHandler<CalculateAmortissementCMTQuery, AmortissementCMTResult>
{
  constructor(private readonly kpiService: KPIService) {}

  async execute(
    query: CalculateAmortissementCMTQuery
  ): Promise<AmortissementCMTResult> {
    const table = this.kpiService.generateAmortissementCMT(
      query.montant,
      query.tauxAnnuel,
      query.nbMois
    );

    return {
      montant: query.montant,
      tauxAnnuel: query.tauxAnnuel,
      nbMois: query.nbMois,
      table,
    };
  }
}
