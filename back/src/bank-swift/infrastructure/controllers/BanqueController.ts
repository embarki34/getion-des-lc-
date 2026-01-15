import { Request, Response, NextFunction } from 'express';
import {
  CreateBanqueCommand,
  CreateBanqueCommandHandler,
} from '../../application/commands/CreateBanqueCommand';
import {
  UpdateBanqueCommand,
  UpdateBanqueCommandHandler,
} from '../../application/commands/UpdateBanqueCommand';
import {
  DeleteBanqueCommand,
  DeleteBanqueCommandHandler,
} from '../../application/commands/DeleteBanqueCommand';
import {
  AddBankAccountCommand,
  AddBankAccountCommandHandler,
} from '../../application/commands/AddBankAccountCommand';
import {
  UpdateBankAccountCommand,
  UpdateBankAccountCommandHandler,
} from '../../application/commands/UpdateBankAccountCommand';
import {
  DeleteBankAccountCommand,
  DeleteBankAccountCommandHandler,
} from '../../application/commands/DeleteBankAccountCommand';
import {
  GetAllBanquesQuery,
  GetAllBanquesQueryHandler,
} from '../../application/queries/GetAllBanquesQuery';
import {
  GetBanqueByIdQuery,
  GetBanqueByIdQueryHandler,
} from '../../application/queries/GetBanqueByIdQuery';
import { BanqueResponseDTO } from '../../application/dto/BanqueDTO';
import { BankAccountResponseDTO } from '../../application/dto/BankAccountDTO';

export class BanqueController {
  constructor(
    private readonly createBanqueHandler: CreateBanqueCommandHandler,
    private readonly updateBanqueHandler: UpdateBanqueCommandHandler,
    private readonly deleteBanqueHandler: DeleteBanqueCommandHandler,
    private readonly getAllBanquesHandler: GetAllBanquesQueryHandler,
    private readonly getBanqueByIdHandler: GetBanqueByIdQueryHandler,
    private readonly addBankAccountHandler: AddBankAccountCommandHandler,
    private readonly updateBankAccountHandler: UpdateBankAccountCommandHandler,
    private readonly deleteBankAccountHandler: DeleteBankAccountCommandHandler
  ) { }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command = new CreateBanqueCommand(req.body);
      const id = await this.createBanqueHandler.execute(command);
      res.status(201).json({ id, message: 'Banque created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new UpdateBanqueCommand(id, req.body);
      await this.updateBanqueHandler.execute(command);
      res.status(200).json({ message: 'Banque updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteBanqueCommand(id);
      await this.deleteBanqueHandler.execute(command);
      res.status(200).json({ message: 'Banque deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new AddBankAccountCommand(id, req.body);
      const accountId = await this.addBankAccountHandler.execute(command);
      res.status(201).json({ id: accountId, message: 'Bank account added successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, accountId } = req.params;
      const command = new UpdateBankAccountCommand(id, accountId, req.body);
      await this.updateBankAccountHandler.execute(command);
      res.status(200).json({ message: 'Bank account updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, accountId } = req.params;
      const command = new DeleteBankAccountCommand(id, accountId);
      await this.deleteBankAccountHandler.execute(command);
      res.status(200).json({ message: 'Bank account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = new GetAllBanquesQuery();
      const banques = await this.getAllBanquesHandler.execute(query);

      const response: BanqueResponseDTO[] = banques.map((b) => this.mapToDTO(b));

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetBanqueByIdQuery(id);
      const banque = await this.getBanqueByIdHandler.execute(query);

      if (!banque) {
        res.status(404).json({ message: 'Banque not found' });
        return;
      }

      res.status(200).json(this.mapToDTO(banque));
    } catch (error) {
      next(error);
    }
  }

  private mapToDTO(banque: any): BanqueResponseDTO {
    const props = banque.props;
    return {
      id: banque.id,
      nom: props.nom,
      codeSwift: props.codeSwift,
      codeGuichet: props.codeGuichet,
      establishment: props.establishment,
      adresse: props.adresse,
      contactInfo: props.contactInfo,
      bankAccounts: (props.bankAccounts || []).map(
        (acc: any) =>
          ({
            id: acc.id,
            accountNumber: acc.accountNumber,
            keyAccount: acc.keyAccount,
            swiftIdentifier: acc.swiftIdentifier,
            currency: acc.currency,
            rib: acc.rib,
            isActive: acc.isActive,
            createdAt: acc.createdAt,
            updatedAt: acc.updatedAt,
          }) as BankAccountResponseDTO
      ),
    };
  }
}
