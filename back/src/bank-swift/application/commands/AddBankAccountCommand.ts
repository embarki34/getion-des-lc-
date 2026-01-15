import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { CreateBankAccountDTO } from '../dto/BankAccountDTO';
import { BankAccount } from '../../domain/entities/BankAccount';
import { v4 as uuidv4 } from 'uuid';

export class AddBankAccountCommand {
    constructor(
        public readonly bankId: string,
        public readonly dto: CreateBankAccountDTO
    ) { }
}

export class AddBankAccountCommandHandler {
    constructor(private readonly repository: BanqueRepository) { }

    async execute(command: AddBankAccountCommand): Promise<string> {
        const banque = await this.repository.findById(command.bankId);
        if (!banque) {
            throw new Error('Banque not found');
        }

        const newAccount = BankAccount.create({
            id: uuidv4(),
            accountNumber: command.dto.accountNumber,
            keyAccount: command.dto.keyAccount,
            currency: command.dto.currency,
            rib: command.dto.rib,
            isActive: command.dto.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            updatedBy: 'system',
            deletedAt: null,
            deletedBy: null,
        });

        banque.addBankAccount(newAccount);

        await this.repository.save(banque);

        return newAccount.id;
    }
}
