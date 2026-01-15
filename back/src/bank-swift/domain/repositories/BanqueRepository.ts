import { Banque } from '../entities/Banque';

export interface BanqueRepository {
  save(banque: Banque): Promise<void>;
  findById(id: string): Promise<Banque | null>;
  findAll(): Promise<Banque[]>;
  findBySwiftCode(code: string): Promise<Banque | null>;
  delete(id: string): Promise<void>;
  countRelatedEntities(id: string): Promise<{ accounts: number; creditLines: number }>;
}
