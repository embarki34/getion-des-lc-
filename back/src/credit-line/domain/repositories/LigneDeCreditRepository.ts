import { LigneDeCredit } from "../entities/LigneDeCredit";

export interface LigneDeCreditRepository {
  save(ligne: LigneDeCredit): Promise<void>;
  findById(id: string): Promise<LigneDeCredit | null>;
  findAll(): Promise<LigneDeCredit[]>;
  findByBanqueId(banqueId: string): Promise<LigneDeCredit[]>;
  delete(id: string): Promise<void>;
  update(ligne: LigneDeCredit): Promise<void>;
  countRelatedEntities(id: string): Promise<{ engagements: number }>;
  findAllGuarantees(): Promise<any[]>;
}
