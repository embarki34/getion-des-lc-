import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { UpdateBankAccountDTO } from '../dto/BankAccountDTO';

export class UpdateBankAccountCommand {
    constructor(
        public readonly bankId: string,
        public readonly accountId: string,
        public readonly dto: UpdateBankAccountDTO
    ) { }
}

export class UpdateBankAccountCommandHandler {
    constructor(private readonly repository: BanqueRepository) { }

    async execute(command: UpdateBankAccountCommand): Promise<void> {
        const banque = await this.repository.findById(command.bankId);
        if (!banque) {
            throw new Error('Banque not found');
        }

        const existingAccount = banque.bankAccounts.find((acc) => acc.id === command.accountId);
        if (!existingAccount) {
            throw new Error('Bank Account not found');
        }

        const updatedAccount = existingAccount.updateDetails(
            'system', // TODO: Get from context/command
            command.dto
        );

        banque.updateBankAccount(updatedAccount);

        await this.repository.save(banque);
    }
}
