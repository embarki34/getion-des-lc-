import { BanqueRepository } from '../../domain/repositories/BanqueRepository';
import { Banque } from '../../domain/entities/Banque';

export class GetBanqueByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetBanqueByIdQueryHandler {
  constructor(private readonly repository: BanqueRepository) {}

  async execute(query: GetBanqueByIdQuery): Promise<Banque | null> {
    return this.repository.findById(query.id);
  }
}
