import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { Banque } from '../../domain/entities/Banque';

export class GetAllBanquesQuery {}

export class GetAllBanquesQueryHandler {
  constructor(private readonly repository: BanqueRepository) {}

  async execute(query: GetAllBanquesQuery): Promise<Banque[]> {
    return this.repository.findAll();
  }
}
