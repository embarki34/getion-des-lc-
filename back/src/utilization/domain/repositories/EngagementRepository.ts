import { Engagement } from "../entities/Engagement";

export interface EngagementRepository {
  save(engagement: Engagement): Promise<void>;
  findById(id: string): Promise<Engagement | null>;
  findByLigneCreditId(ligneId: string): Promise<Engagement[]>;
  sumEncoursByLigneId(ligneId: string): Promise<number>;
}
