import { LigneDeCreditRepository } from "../../../credit-line/domain/repositories/LigneDeCreditRepository";
import { EngagementRepository } from "../../../utilization/domain/repositories/EngagementRepository";

export interface KPIResult {
  totalLignesCredit: number;
  encoursTotal: number;
  tauxUtilisationMoyen: number;
  plafondTotal: number;
  disponibiliteTotal: number;
  nombreEngagementsActifs: number;
}

export class KPIService {
  constructor(
    private readonly ligneCreditRepo: LigneDeCreditRepository,
    private readonly engagementRepo: EngagementRepository
  ) {}

  async calculateGlobalKPIs(): Promise<KPIResult> {
    const lignes = await this.ligneCreditRepo.findAll();

    let encoursTotal = 0;
    let plafondTotal = 0;
    let nombreEngagementsActifs = 0;

    for (const ligne of lignes) {
      plafondTotal += ligne.montantPlafond;
      const encours = await this.engagementRepo.sumEncoursByLigneId(ligne.id);
      encoursTotal += encours;

      const engagements = await this.engagementRepo.findByLigneCreditId(
        ligne.id
      );
      nombreEngagementsActifs += engagements.filter(
        (e) => e.statut === "EN_COURS"
      ).length;
    }

    const disponibiliteTotal = plafondTotal - encoursTotal;
    const tauxUtilisationMoyen =
      plafondTotal > 0 ? (encoursTotal / plafondTotal) * 100 : 0;

    return {
      totalLignesCredit: lignes.length,
      encoursTotal,
      tauxUtilisationMoyen: Math.round(tauxUtilisationMoyen * 100) / 100,
      plafondTotal,
      disponibiliteTotal,
      nombreEngagementsActifs,
    };
  }

  async calculateTauxUtilisation(ligneCreditId: string): Promise<number> {
    const ligne = await this.ligneCreditRepo.findById(ligneCreditId);
    if (!ligne) {
      throw new Error(`Credit line not found: ${ligneCreditId}`);
    }

    const encours = await this.engagementRepo.sumEncoursByLigneId(
      ligneCreditId
    );
    return ligne.montantPlafond > 0
      ? (encours / ligne.montantPlafond) * 100
      : 0;
  }

  /**
   * Calculate interest: intérêts = encours * taux * (nb_jours / 360)
   */
  calculateInterest(
    encours: number,
    tauxAnnuel: number,
    nbJours: number
  ): number {
    return encours * (tauxAnnuel / 100) * (nbJours / 360);
  }

  /**
   * Generate CMT amortization table
   */
  generateAmortissementCMT(
    montant: number,
    tauxAnnuel: number,
    nbMois: number
  ): Array<{
    mois: number;
    capital: number;
    interet: number;
    mensualite: number;
    capitalRestant: number;
  }> {
    const tauxMensuel = tauxAnnuel / 100 / 12;
    const mensualite =
      (montant * (tauxMensuel * Math.pow(1 + tauxMensuel, nbMois))) /
      (Math.pow(1 + tauxMensuel, nbMois) - 1);

    const table = [];
    let capitalRestant = montant;

    for (let mois = 1; mois <= nbMois; mois++) {
      const interet = capitalRestant * tauxMensuel;
      const capital = mensualite - interet;
      capitalRestant -= capital;

      table.push({
        mois,
        capital: Math.round(capital * 100) / 100,
        interet: Math.round(interet * 100) / 100,
        mensualite: Math.round(mensualite * 100) / 100,
        capitalRestant: Math.round(Math.max(0, capitalRestant) * 100) / 100,
      });
    }

    return table;
  }
}
