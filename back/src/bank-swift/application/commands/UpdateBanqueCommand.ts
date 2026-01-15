import { Banque } from '../../domain/entities/Banque';
import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { UpdateBanqueDTO } from '../dto/BanqueDTO';

export class UpdateBanqueCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBanqueDTO
  ) {}
}

export class UpdateBanqueCommandHandler {
  constructor(private readonly repository: BanqueRepository) {}

  async execute(command: UpdateBanqueCommand): Promise<void> {
    const banque = await this.repository.findById(command.id);
    if (!banque) {
      throw new Error('Banque not found');
    }

    // Accessing private props via 'any' escape for this CRUD-like operation
    // In strict DDD, add specific update methods to the Entity.
    const currentProps = (banque as any).props;

    // Note: This spread update is convenient for CRUD but bypasses granular domain logic if any.
    // However, validation in 'create' will still run.
    const updatedBanque = Banque.create(
      {
        nom: command.dto.nom ?? currentProps.nom,
        codeSwift: command.dto.codeSwift ?? currentProps.codeSwift,
        establishment: command.dto.establishment ?? currentProps.establishment ?? '',
        adresse: command.dto.adresse ?? currentProps.adresse,
        contactInfo: command.dto.contactInfo ?? currentProps.contactInfo,
        bankAccounts: currentProps.bankAccounts, // Preserve accounts
      },
      command.id
    );

    await this.repository.save(updatedBanque);
  }
}
