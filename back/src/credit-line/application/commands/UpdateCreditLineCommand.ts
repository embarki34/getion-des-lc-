import { LigneDeCredit } from '../../domain/entities/LigneDeCredit';
import { LigneDeCreditRepository } from '../../domain/repositories/LigneDeCreditRepository';
import { ValidationError } from '../../../shared/errors/ConcreteErrors';
import { ErrorCodes } from '../../../shared/errors/ErrorCodes';

export class UpdateCreditLineCommand {
    constructor(
        public readonly id: string,
        public readonly data: any // Using specific type would be better, but 'any' allows flexibility for now matching props
    ) { }
}

export class UpdateCreditLineCommandHandler {
    constructor(private readonly repository: LigneDeCreditRepository) { }

    async execute(command: UpdateCreditLineCommand): Promise<void> {
        const existingListing = await this.repository.findById(command.id);

        if (!existingListing) {
            throw new ValidationError('Credit line not found', ErrorCodes.VALIDATION_ERROR);
        }

        // Since we are inside the application layer, we need to access the props to merge.
        // In a strict DDD implementation, LigneDeCredit would have specific methods for updating fields (e.g., updateFinancials, updateSchedule).
        // However, for this CRUD-like operation, accessing props (assuming a getter or accessing protected) is practical.

        // Retrieve existing props via a getter or direct access if allowed (using 'as any' to bypass private if necessary for this fix)
        // Ideally, we add a getter `getProps()` to the AggregateRoot or similar.
        // For now, consistent with how repositories often work in this codebase:
        const existingProps = (existingListing as any).props;

        const updatedProps = {
            ...existingProps,
            ...command.data, // Merge new data overwriting existing
            // Ensure ID remains consistent
            id: existingProps.id
        };

        // Transform garanties plain objects to Garantie entities if present
        if (updatedProps.garanties && Array.isArray(updatedProps.garanties)) {
            const { Garantie } = await import('../../domain/entities/Garantie');
            updatedProps.garanties = updatedProps.garanties.map((g: any) => {
                // Check if it's already an instance to avoid double wrapping if logic changes
                if (g instanceof Garantie) return g;

                return Garantie.create({
                    type: g.type,
                    montant: g.montant,
                    dateExpiration: typeof g.dateExpiration === 'string' ? new Date(g.dateExpiration) : g.dateExpiration,
                    description: g.description
                }, g.id); // Preserve ID if updating existing guarantee
            });
        }

        const updatedLigne = LigneDeCredit.create(
            updatedProps,
            command.id
        );

        // Persist
        await this.repository.update(updatedLigne);
    }
}
