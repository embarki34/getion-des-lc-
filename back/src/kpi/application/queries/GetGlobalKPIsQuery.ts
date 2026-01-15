import { IQuery, IQueryHandler } from "../../../shared/application/IQuery";
import { KPIService, KPIResult } from "../../domain/services/KPIService";

export class GetGlobalKPIsQuery implements IQuery<KPIResult> {}

export class GetGlobalKPIsQueryHandler
  implements IQueryHandler<GetGlobalKPIsQuery, KPIResult>
{
  constructor(private readonly kpiService: KPIService) {}

  async execute(query: GetGlobalKPIsQuery): Promise<KPIResult> {
    return await this.kpiService.calculateGlobalKPIs();
  }
}
