import { BanqueRepository } from '../../domain/repositories/BanqueRepository';

export class DeleteBankAccountCommand {
    constructor(
        public readonly bankId: string,
        public readonly accountId: string
    ) { }
}

export class DeleteBankAccountCommandHandler {
    constructor(private readonly repository: BanqueRepository) { }

    async execute(command: DeleteBankAccountCommand): Promise<void> {
        const banque = await this.repository.findById(command.bankId);
        if (!banque) {
            throw new Error('Banque not found');
        }

        banque.removeBankAccount(command.accountId);

        await this.repository.save(banque);
    }
}
