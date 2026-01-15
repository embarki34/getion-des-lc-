import { ICommand, ICommandHandler } from '../../../shared/application/ICommand';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { LigneDeCredit } from '../../domain/entities/LigneDeCredit';
import { Garantie } from '../../domain/entities/Garantie';
import { CreateLigneDeCreditDTO } from '../dto/LigneDeCreditDTO';
import { BanqueRepository } from '../../../bank-swift/domain/repositories/BanqueRepository';

export class CreateCreditLineCommand implements ICommand {
  constructor(public readonly data: CreateLigneDeCreditDTO) {}
}

export class CreateCreditLineCommandHandler implements ICommandHandler<
  CreateCreditLineCommand,
  string
> {
  constructor(
    private readonly repository: LigneDeCreditRepository,
    private readonly banqueRepository: BanqueRepository
  ) {}

  async execute(command: CreateCreditLineCommand): Promise<string> {
    const { data } = command;

    // Validate if Bank exists
    const banque = await this.banqueRepository.findById(data.banqueId);
    if (!banque) {
      throw new Error(`Banque with ID ${data.banqueId} not found`);
    }

    const garanties = (data.garanties || []).map((g) =>
      Garantie.create({
        type: g.type,
        montant: g.montant,
        dateExpiration: new Date(g.dateExpiration),
        description: g.description,
      })
    );

    const ligneDeCredit = LigneDeCredit.create({
      no: data.no,
      description: data.description,
      banqueId: data.banqueId,
      autorisationNo: data.autorisationNo,
      bankAccountNo: data.bankAccountNo,
      montantPlafond: data.montantPlafond,
      montantDevise: data.montantDevise,
      taux: data.taux,
      commitmentCommissionRate: data.commitmentCommissionRate,
      estimatedOutstanding: 0, // Initial state
      consumption: 0,
      outstanding: 0,
      startDate: new Date(data.startDate),
      expiryDate: new Date(data.expiryDate),
      statut: 'OUVERT',
      typeFinancement: data.typeFinancement,
      responsibilityCenter: data.responsibilityCenter,
      maxConsumptionTolerance: data.maxConsumptionTolerance,
      minConsumptionTolerance: data.minConsumptionTolerance,
      noSeries: data.noSeries,
      refinancing: data.refinancing,
      thresholds: data.thresholds,
      consumptionBreakdown: {
        avanceSurStock: 0,
        avanceFacture: 0,
        escompte: 0,
        obligatDouane: 0,
        cautionAdmin: 0,
        dcvrtMobile: 0,
        trsfrLibre: 0,
        leasing: 0,
        CMT: 0,
        fraisMission: 0,
        LCAS: 0,
        faciliteCaissier: 0,
      },
      garanties,
    });

    await this.repository.save(ligneDeCredit);

    return ligneDeCredit.id;
  }
}
