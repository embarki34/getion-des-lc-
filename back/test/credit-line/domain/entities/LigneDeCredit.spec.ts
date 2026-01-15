import { LigneDeCredit } from '../../../../src/credit-line/domain/entities/LigneDeCredit';
import { Garantie } from '../../../../src/credit-line/domain/entities/Garantie';

describe('LigneDeCredit Entity', () => {
  const defaultThresholds = {
    seuilAvanceSurStock: 0,
    seuilAvanceSurFacture: 0,
    seuilEscompte: 0,
    seuilLC: 0,
    seuilObligtDouane: 0,
    seuilCautionAdmin: 0,
    seuilDcvrtMobile: 0,
    seuilTrsfrLibre: 0,
    seuilLeasing: 0,
    seuilCMT: 0,
    seuilFraisMission: 0,
    seuilLCAS: 0,
  };

  const defaultConsumption = {
    avanceSurStock: 0,
    avanceFacture: 0,
    escompte: 0,
    obligatDouane: 0,
    cautionAdmin: 0,
    dcvrtMobile: 0,
    trsfrLibre: 0,
    leasing: 0,
    CMT: 0,
    fraisMission: 0,
    LCAS: 0,
    faciliteCaissier: 0,
  };

  const validProps = {
    no: 'LC-2024-001',
    banqueId: 'bank-123',
    autorisationNo: 'AUTH-001',
    bankAccountNo: 'ACC-001',
    montantPlafond: 500000,
    montantDevise: 'DZD',
    taux: 5.5,
    commitmentCommissionRate: 1.2,
    estimatedOutstanding: 0,
    consumption: 0,
    outstanding: 500000,
    startDate: new Date('2024-01-01'),
    expiryDate: new Date('2025-12-31'),
    statut: 'OUVERT' as const,
    typeFinancement: 'LC',
    maxConsumptionTolerance: 0,
    minConsumptionTolerance: 0,
    noSeries: 'SERIE-A',
    refinancing: 0,
    thresholds: defaultThresholds,
    consumptionBreakdown: defaultConsumption,
    garanties: [],
  };

  it('should create a valid credit line', () => {
    const ligne = LigneDeCredit.create(validProps);

    expect(ligne).toBeDefined();
    expect(ligne.montantPlafond).toBe(500000);
    expect(ligne.statut).toBe('OUVERT');
  });

  it('should throw error if end date is before start date', () => {
    expect(() => {
      LigneDeCredit.create({
        ...validProps,
        startDate: new Date('2025-12-31'),
        expiryDate: new Date('2024-01-01'),
      });
    }).toThrow('Expiry date must be after start date');
  });

  it('should add a garantie', () => {
    const ligne = LigneDeCredit.create(validProps);

    const garantie = Garantie.create({
      type: 'CAUTION',
      montant: 50000,
      dateExpiration: new Date('2025-12-31'),
    });

    ligne.addGarantie(garantie);
    expect(ligne.garanties).toHaveLength(1);
  });

  it('should update consumption', () => {
    const ligne = LigneDeCredit.create(validProps);
    ligne.updateConsumption(100000);

    const updatedProps = (ligne as any).props;
    expect(updatedProps.consumption).toBe(100000);
    expect(updatedProps.outstanding).toBe(400000); // 500k - 100k
  });
});
