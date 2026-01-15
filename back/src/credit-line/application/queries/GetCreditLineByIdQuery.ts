import { IQuery, IQueryHandler } from '../../../shared/application/IQuery';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { LigneDeCreditResponseDTO } from '../dto/LigneDeCreditDTO';

export class GetCreditLineByIdQuery implements IQuery<LigneDeCreditResponseDTO | null> {
  constructor(public readonly id: string) { }
}

export class GetCreditLineByIdQueryHandler implements IQueryHandler<
  GetCreditLineByIdQuery,
  LigneDeCreditResponseDTO | null
> {
  constructor(private readonly repository: LigneDeCreditRepository) { }

  async execute(query: GetCreditLineByIdQuery): Promise<LigneDeCreditResponseDTO | null> {
    const ligne = await this.repository.findById(query.id);

    if (!ligne) {
      return null;
    }

    const props = ligne['props'];
    return {
      id: ligne.id,
      no: props.no,
      banqueId: ligne.banqueId,
      description: props.description,
      autorisationNo: props.autorisationNo,
      bankAccountNo: props.bankAccountNo,

      montantPlafond: ligne.montantPlafond,
      montantDevise: ligne.devise, // Map domain 'devise' getter to DTO 'montantDevise'
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

      thresholds: ligne.thresholds, // uses getter which returns object

      garanties: ligne.garanties.map((g) => ({
        id: g.id,
        type: g.type,
        montant: g.montant,
        dateExpiration: g.dateExpiration.toISOString(),
        description: g.description,
      })),
    } as LigneDeCreditResponseDTO;
  }
}
