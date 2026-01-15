import { IQuery, IQueryHandler } from '../../../shared/application/IQuery';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';

export class ListGuaranteesQuery implements IQuery<any[]> {
    constructor() { }
}

export class ListGuaranteesQueryHandler implements IQueryHandler<
    ListGuaranteesQuery,
    any[]
> {
    constructor(private readonly repository: LigneDeCreditRepository) { }

    async execute(query: ListGuaranteesQuery): Promise<any[]> {
        const guarantees = await this.repository.findAllGuarantees();

        return guarantees.map(g => ({
            id: g.id,
            creditLineId: g.ligneCreditId,
            creditLineNo: g.ligneCredit?.no || g.ligneCredit?.description || g.ligneCreditId, // Fallback
            type: g.type,
            montant: g.montant,
            dateExpiration: g.dateExpiration,
            description: g.description,
            status: g.ligneCredit?.statut || "UNKNOWN", // Use Credit Line status
        }));
    }
}
