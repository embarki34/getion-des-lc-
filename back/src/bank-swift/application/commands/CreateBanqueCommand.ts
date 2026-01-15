import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { Banque } from '../../domain/entities/Banque';
import { BankAccount } from '../../domain/entities/BankAccount';
import { CreateBanqueDTO } from '../dto/BanqueDTO';
import { v4 as uuidv4 } from 'uuid';

export class CreateBanqueCommand {
  constructor(public readonly dto: CreateBanqueDTO) {}
}

export class CreateBanqueCommandHandler {
  constructor(private readonly repository: BanqueRepository) {}

  async execute(command: CreateBanqueCommand): Promise<string> {
    // Create bank accounts if provided
    const bankAccounts = (command.dto.bankAccounts || []).map((acc) =>
      BankAccount.create({
        id: uuidv4(), // Generate proper UUID
        accountNumber: acc.accountNumber,
        keyAccount: acc.keyAccount,
        currency: acc.currency,
        rib: acc.rib,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isActive: true,
        createdBy: 'system', // Should come from auth context
        updatedBy: 'system',
        deletedBy: null,
      })
    );

    const banque = Banque.create({
      nom: command.dto.nom,
      codeSwift: command.dto.codeSwift,
      codeGuichet: command.dto.codeGuichet,
      establishment: command.dto.establishment,
      adresse: command.dto.adresse,
      contactInfo: command.dto.contactInfo,
      bankAccounts: bankAccounts,
    });

    await this.repository.save(banque);
    return banque.id;
  }
}
