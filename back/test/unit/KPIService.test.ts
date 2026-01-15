import { KPIService } from "../../../src/kpi/domain/services/KPIService";

describe("KPIService", () => {
  let kpiService: KPIService;

  beforeEach(() => {
    // Mock repositories would be injected here
    kpiService = new KPIService(null as any, null as any);
  });

  describe("calculateInterest", () => {
    it("should calculate interest correctly", () => {
      const encours = 100000;
      const tauxAnnuel = 5; // 5%
      const nbJours = 30;

      const interest = kpiService.calculateInterest(
        encours,
        tauxAnnuel,
        nbJours
      );

      // Expected: 100000 * 0.05 * (30/360) = 416.67
      expect(Math.round(interest * 100) / 100).toBe(416.67);
    });
  });

  describe("generateAmortissementCMT", () => {
    it("should generate correct amortization table", () => {
      const montant = 100000;
      const tauxAnnuel = 6; // 6%
      const nbMois = 12;

      const table = kpiService.generateAmortissementCMT(
        montant,
        tauxAnnuel,
        nbMois
      );

      expect(table).toHaveLength(12);
      expect(table[0].mois).toBe(1);
      expect(table[11].mois).toBe(12);

      // Last month should have capital restant close to 0
      expect(table[11].capitalRestant).toBeLessThan(1);

      // Sum of all capital should equal montant
      const totalCapital = table.reduce((sum, row) => sum + row.capital, 0);
      expect(Math.round(totalCapital)).toBe(montant);
    });
  });
});
