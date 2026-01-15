import { IQuery, IQueryHandler } from '../../../shared/application/IQuery';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { LigneDeCreditResponseDTO } from '../dto/LigneDeCreditDTO';

export class ListCreditLinesQuery implements IQuery<LigneDeCreditResponseDTO[]> {
  constructor(public readonly banqueId?: string) { }
}

export class ListCreditLinesQueryHandler implements IQueryHandler<
  ListCreditLinesQuery,
  LigneDeCreditResponseDTO[]
> {
  constructor(private readonly repository: LigneDeCreditRepository) { }

  async execute(query: ListCreditLinesQuery): Promise<LigneDeCreditResponseDTO[]> {
    const lignes = query.banqueId
      ? await this.repository.findByBanqueId(query.banqueId)
      : await this.repository.findAll();

    return lignes.map((ligne) => {
      const props = ligne['props']; // Or use getters if available
      return {
        id: ligne.id,
        no: props.no,
        banqueId: ligne.banqueId,
        description: props.description,
        autorisationNo: props.autorisationNo,
        bankAccountNo: props.bankAccountNo,

        montantPlafond: ligne.montantPlafond,
        montantDevise: ligne.devise,
        taux: props.taux,
        commitmentCommissionRate: props.commitmentCommissionRate,

        statut: ligne.statut,

        startDate: props.startDate,
        expiryDate: props.expiryDate,

        typeFinancement: props.typeFinancement,
        responsibilityCenter: props.responsibilityCenter,

        maxConsumptionTolerance: props.maxConsumptionTolerance,
        minConsumptionTolerance: props.minConsumptionTolerance,
        noSeries: props.noSeries,
        refinancing: props.refinancing,

        consumption: props.consumption,
        outstanding: props.outstanding,

        thresholds: ligne.thresholds,

        garanties: ligne.garanties.map((g) => ({
          id: g.id,
          type: g.type,
          montant: g.montant,
          dateExpiration: g.dateExpiration.toISOString(),
          description: g.description,
        })),
      } as LigneDeCreditResponseDTO;
    });
  }
}
