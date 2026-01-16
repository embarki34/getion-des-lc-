import { PrismaClient } from '../identity/infrastructure/persistence/prisma/client';


const prisma = new PrismaClient();

/**
 * Seed Workflow Templates for Condor Electronics Credit Line Management
 * Based on business requirements: LC, AS, AF, RD, CMT
 */
async function seedWorkflowTemplates() {
    console.log('🌱 Seeding workflow templates...');

    // 1. LETTRE DE CRÉDIT (LC) - Letter of Credit
    const lcTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'LC' },
        update: {
            label: 'Lettre de Crédit (LC)',
            description: 'Engagement irrévocable de la banque de payer le bénéficiaire si les documents contractuels sont conformes (UCP 600 / ISBP)',
            color: '#3B82F6',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'fournisseur', label: 'Fournisseur', type: 'relation', relationTo: 'suppliers', required: true },
                    { name: 'banque', label: 'Banque Émettrice', type: 'relation', relationTo: 'banks', required: true },
                    { name: 'montant', label: 'Montant', type: 'number', required: true },
                    { name: 'devise', label: 'Devise', type: 'select', options: ['DZD', 'USD', 'EUR'], required: true },
                    { name: 'proforma', label: 'Facture Proforma', type: 'text', required: true },
                    { name: 'bonCommande', label: 'Bon de Commande', type: 'text', required: true },
                ]
            }
        },
        create: {
            code: 'LC',
            label: 'Lettre de Crédit (LC)',
            description: 'Engagement irrévocable de la banque de payer le bénéficiaire si les documents contractuels sont conformes (UCP 600 / ISBP)',
            color: '#3B82F6',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'fournisseur', label: 'Fournisseur', type: 'relation', relationTo: 'suppliers', required: true },
                    { name: 'banque', label: 'Banque Émettrice', type: 'relation', relationTo: 'banks', required: true },
                    { name: 'montant', label: 'Montant', type: 'number', required: true },
                    { name: 'devise', label: 'Devise', type: 'select', options: ['DZD', 'USD', 'EUR'], required: true },
                    { name: 'proforma', label: 'Facture Proforma', type: 'text', required: true },
                    { name: 'bonCommande', label: 'Bon de Commande', type: 'text', required: true },
                ]
            }
        }
    });

    // Clear existing steps to ensure fresh order and config
    await prisma.workflowStep.deleteMany({
        where: { workflowTemplateId: lcTemplate.id }
    });

    await prisma.workflowStep.createMany({
        data: [
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 1,
                code: 'LC_DEMANDE',
                label: 'Demande LC',
                description: 'Initiation de la demande de Lettre de Crédit',
                requiredFields: [
                    { name: 'montantDemande', label: 'Montant Demandé', type: 'number', required: true },
                    { name: 'dateEcheance', label: 'Date d\'Échéance', type: 'date', required: true }
                ],
                color: '#3B82F6',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 2,
                code: 'LC_VERIF',
                label: 'Vérifications Documentaires',
                description: 'Contrôle de conformité des documents',
                requiredFields: [
                    { name: 'documentsConformes', label: 'Documents Conformes', type: 'checkbox', required: true }
                ],
                color: '#F59E0B',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 3,
                code: 'LC_APPROBATION',
                label: 'Approbation Interne',
                description: 'Validation par le comité crédit si requis',
                requiresApproval: true,
                approvalRoles: ['FINANCE_MANAGER', 'TREASURY'],
                color: '#8B5CF6',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 4,
                code: 'LC_SWIFT',
                label: 'Émission SWIFT MT700',
                description: 'Envoi du message SWIFT et notification banque correspondante',
                requiredFields: [
                    { name: 'numeroSwift', label: 'Numéro SWIFT', type: 'text', required: true },
                    { name: 'dateEmission', label: 'Date d\'Émission', type: 'date', required: true }
                ],
                color: '#10B981',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 5,
                code: 'LC_RECEPTION_DOCS',
                label: 'Réception Documents',
                description: 'Réception des documents d\'expédition par la banque',
                requiredDocuments: ['Bill of Lading', 'Invoice', 'Packing List', 'Certificate of Origin'],
                color: '#EC4899',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 6,
                code: 'LC_CONTROLE',
                label: 'Contrôle Documentaire ISBP',
                description: 'Vérification ISBP et décision de paiement',
                requiredFields: [
                    { name: 'controleIsbp', label: 'Contrôle ISBP Conforme', type: 'checkbox', required: true }
                ],
                color: '#F59E0B',
            },
            {
                workflowTemplateId: lcTemplate.id,
                stepOrder: 7,
                code: 'LC_PAIEMENT',
                label: 'Déblocage Paiement',
                description: 'Paiement effectué et mise à jour encours',
                requiredFields: [
                    { name: 'montantPaye', label: 'Montant Payé', type: 'number', required: true },
                    { name: 'datePaiement', label: 'Date de Paiement', type: 'date', required: true }
                ],
                color: '#10B981',
            }
        ]
    });

    // 2. AVANCE SUR STOCK (AS) - Stock Advance
    const asTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'AS' },
        update: {
            label: 'Avance sur Stock (AS)',
            description: 'Crédit court terme adossé à la valeur du stock d\'articles importés',
            color: '#8B5CF6',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'lcReference', label: 'Référence LC', type: 'text', required: false },
                    { name: 'banque', label: 'Banque', type: 'relation', relationTo: 'banks', required: true },
                    { name: 'valeurStock', label: 'Valeur Stock', type: 'number', required: true },
                ]
            }
        },
        create: {
            code: 'AS',
            label: 'Avance sur Stock (AS)',
            description: 'Crédit court terme adossé à la valeur du stock d\'articles importés',
            color: '#8B5CF6',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'lcReference', label: 'Référence LC', type: 'text', required: false },
                    { name: 'banque', label: 'Banque', type: 'relation', relationTo: 'banks', required: true },
                    { name: 'valeurStock', label: 'Valeur Stock', type: 'number', required: true },
                ]
            }
        }
    });

    // Clear existing steps
    await prisma.workflowStep.deleteMany({
        where: { workflowTemplateId: asTemplate.id }
    });

    await prisma.workflowStep.createMany({
        data: [
            {
                workflowTemplateId: asTemplate.id,
                stepOrder: 1,
                code: 'AS_CALCUL',
                label: 'Calcul Montant Éligible',
                description: 'Calcul = Σ items éligibles × taux de prise en charge',
                requiredFields: [
                    { name: 'valeurItems', label: 'Valeur Items Éligibles', type: 'number', required: true },
                    { name: 'tauxPriseEnCharge', label: 'Taux de Prise en Charge (%)', type: 'number', required: true },
                    {
                        name: 'montantEligible',
                        label: 'Montant Éligible Calculé',
                        type: 'calculated',
                        formula: 'valeurItems * (tauxPriseEnCharge / 100)',
                        calculatedFrom: ['valeurItems', 'tauxPriseEnCharge'],
                        readonly: true
                    }
                ],
                color: '#8B5CF6',
            },
            {
                workflowTemplateId: asTemplate.id,
                stepOrder: 2,
                code: 'AS_DOCS',
                label: 'Contrôle Documents',
                description: 'Vérification des documents stock',
                requiredDocuments: ['Inventaire Stock', 'Factures Fournisseur', 'Bon de Réception'],
                color: '#F59E0B',
            },
            {
                workflowTemplateId: asTemplate.id,
                stepOrder: 3,
                code: 'AS_DEBLOCAGE',
                label: 'Déblocage Avance',
                description: 'Financement stock accordé',
                requiredFields: [
                    { name: 'montantAccorde', label: 'Montant Accordé', type: 'number', required: true },
                    { name: 'dateDeblocage', label: 'Date Déblocage', type: 'date', required: true }
                ],
                color: '#10B981',
            },
            {
                workflowTemplateId: asTemplate.id,
                stepOrder: 4,
                code: 'AS_SUIVI',
                label: 'Suivi Stock Financé',
                description: 'Suivi trimestriel / audit physique',
                requiredFields: [
                    { name: 'dateAudit', label: 'Date Audit', type: 'date', required: true },
                    { name: 'stockPhysique', label: 'Stock Physique Vérifié', type: 'checkbox', required: true }
                ],
                color: '#6366F1',
            }
        ]
    });

    // 3. AVANCE SUR FACTURE (AF) - Invoice Advance
    const afTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'AF' },
        update: {
            label: 'Avance sur Facture (AF)',
            description: 'Avance partielle sur facture émise en attendant encaissement',
            color: '#EC4899',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'client', label: 'Client Débiteur', type: 'relation', relationTo: 'companies', required: true },
                    { name: 'numeroFacture', label: 'Numéro Facture', type: 'text', required: true },
                    { name: 'montantFacture', label: 'Montant Facture', type: 'number', required: true },
                    { name: 'avecRecours', label: 'Avec Recours', type: 'checkbox', required: true },
                ]
            }
        },
        create: {
            code: 'AF',
            label: 'Avance sur Facture (AF)',
            description: 'Avance partielle sur facture émise en attendant encaissement',
            color: '#EC4899',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'client', label: 'Client Débiteur', type: 'relation', relationTo: 'companies', required: true },
                    { name: 'numeroFacture', label: 'Numéro Facture', type: 'text', required: true },
                    { name: 'montantFacture', label: 'Montant Facture', type: 'number', required: true },
                    { name: 'avecRecours', label: 'Avec Recours', type: 'checkbox', required: true },
                ]
            }
        }
    });

    // Clear existing steps
    await prisma.workflowStep.deleteMany({
        where: { workflowTemplateId: afTemplate.id }
    });

    await prisma.workflowStep.createMany({
        data: [
            {
                workflowTemplateId: afTemplate.id,
                stepOrder: 1,
                code: 'AF_SOLVABILITE',
                label: 'Vérification Solvabilité Client',
                description: 'Analyse de la solvabilité du débiteur',
                requiredFields: [
                    { name: 'noteSolvabilite', label: 'Note de Solvabilité', type: 'select', options: ['A', 'B', 'C', 'D'], required: true }
                ],
                color: '#EC4899',
            },
            {
                workflowTemplateId: afTemplate.id,
                stepOrder: 2,
                code: 'AF_VALIDATION',
                label: 'Acceptation Facture',
                description: 'Validation et acceptation de la facture',
                requiresApproval: true,
                approvalRoles: ['FINANCE_MANAGER'],
                color: '#8B5CF6',
            },
            {
                workflowTemplateId: afTemplate.id,
                stepOrder: 3,
                code: 'AF_DEBLOCAGE',
                label: 'Déblocage Partiel',
                description: 'Versement de l\'avance partielle',
                requiredFields: [
                    { name: 'tauxAvance', label: 'Taux d\'Avance (%)', type: 'number', required: true },
                    { name: 'montantAvance', label: 'Montant Avance', type: 'number', required: true }
                ],
                color: '#10B981',
            }
        ]
    });

    // 4. REMISE DOCUMENTAIRE (RD) - Documentary Collection
    const rdTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'RD' },
        update: {
            label: 'Remise Documentaire (RD)',
            description: 'Remise des documents contre paiement (D/P) ou acceptation (D/A)',
            color: '#F59E0B',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'fournisseur', label: 'Fournisseur', type: 'relation', relationTo: 'suppliers', required: true },
                    { name: 'typeRemise', label: 'Type de Remise', type: 'select', options: ['D/P - Documents contre Paiement', 'D/A - Documents contre Acceptation'], required: true },
                    { name: 'montant', label: 'Montant', type: 'number', required: true },
                ]
            }
        },
        create: {
            code: 'RD',
            label: 'Remise Documentaire (RD)',
            description: 'Remise des documents contre paiement (D/P) ou acceptation (D/A)',
            color: '#F59E0B',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'ligneCredit', label: 'Ligne de Crédit', type: 'relation', relationTo: 'creditLines', required: true },
                    { name: 'fournisseur', label: 'Fournisseur', type: 'relation', relationTo: 'suppliers', required: true },
                    { name: 'typeRemise', label: 'Type de Remise', type: 'select', options: ['D/P - Documents contre Paiement', 'D/A - Documents contre Acceptation'], required: true },
                    { name: 'montant', label: 'Montant', type: 'number', required: true },
                ]
            }
        }
    });

    // Clear existing steps
    await prisma.workflowStep.deleteMany({
        where: { workflowTemplateId: rdTemplate.id }
    });

    await prisma.workflowStep.createMany({
        data: [
            {
                workflowTemplateId: rdTemplate.id,
                stepOrder: 1,
                code: 'RD_DOSSIER',
                label: 'Constitution Dossier',
                description: 'Préparation du dossier documentaire',
                requiredDocuments: ['Facture Commerciale', 'Connaissement', 'Liste de Colisage'],
                color: '#F59E0B',
            },
            {
                workflowTemplateId: rdTemplate.id,
                stepOrder: 2,
                code: 'RD_REMISE_DOCS',
                label: 'Remise Documents Banque',
                description: 'Transmission des documents à la banque',
                requiredFields: [
                    { name: 'dateRemise', label: 'Date de Remise', type: 'date', required: true }
                ],
                color: '#6366F1',
            },
            {
                workflowTemplateId: rdTemplate.id,
                stepOrder: 3,
                code: 'RD_PAIEMENT',
                label: 'Paiement ou Acceptation',
                description: 'Réception paiement ou acceptation traite',
                requiredFields: [
                    { name: 'datePaiement', label: 'Date Paiement/Acceptation', type: 'date', required: true },
                    { name: 'montantRecu', label: 'Montant Reçu', type: 'number', required: true }
                ],
                color: '#10B981',
            }
        ]
    });

    // 5. CRÉDIT MOYEN TERME (CMT) - Medium Term Credit
    const cmtTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'CMT' },
        update: {
            label: 'Crédit Moyen Terme (CMT)',
            description: 'Prêt amortissable (2-7 ans) pour financement d\'investissements matériels',
            color: '#10B981',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'objetInvestissement', label: 'Objet Investissement', type: 'textarea', required: true },
                    { name: 'montantTotal', label: 'Montant Total', type: 'number', required: true },
                    { name: 'dureeAns', label: 'Durée (années)', type: 'number', required: true },
                    { name: 'banque', label: 'Banque Prêteuse', type: 'relation', relationTo: 'banks', required: true },
                ]
            }
        },
        create: {
            code: 'CMT',
            label: 'Crédit Moyen Terme (CMT)',
            description: 'Prêt amortissable (2-7 ans) pour financement d\'investissements matériels',
            color: '#10B981',
            isActive: true,
            formSchema: {
                fields: [
                    { name: 'objetInvestissement', label: 'Objet Investissement', type: 'textarea', required: true },
                    { name: 'montantTotal', label: 'Montant Total', type: 'number', required: true },
                    { name: 'dureeAns', label: 'Durée (années)', type: 'number', required: true },
                    { name: 'banque', label: 'Banque Prêteuse', type: 'relation', relationTo: 'banks', required: true },
                ]
            }
        }
    });

    // Clear existing steps
    await prisma.workflowStep.deleteMany({
        where: { workflowTemplateId: cmtTemplate.id }
    });

    await prisma.workflowStep.createMany({
        data: [
            {
                workflowTemplateId: cmtTemplate.id,
                stepOrder: 1,
                code: 'CMT_BESOIN',
                label: 'Étude Besoin Investissement',
                description: 'Analyse du besoin et justification de l\'investissement',
                requiredFields: [
                    { name: 'justificatif', label: 'Justificatif Besoin', type: 'textarea', required: true },
                    { name: 'montantInvestissement', label: 'Montant Investissement', type: 'number', required: true }
                ],
                color: '#10B981',
            },
            {
                workflowTemplateId: cmtTemplate.id,
                stepOrder: 2,
                code: 'CMT_AMORTISSEMENT',
                label: 'Plan d\'Amortissement',
                description: 'Calcul annuité constante: A = C × r(1+r)^n / ((1+r)^n - 1)',
                requiredFields: [
                    { name: 'capital', label: 'Capital (C)', type: 'number', required: true },
                    { name: 'tauxPeriodique', label: 'Taux Périodique (r)', type: 'number', required: true, placeholder: 'Ex: 0.05 pour 5%' },
                    { name: 'nombrePeriodes', label: 'Nombre de Périodes (n)', type: 'number', required: true },
                    {
                        name: 'annuite',
                        label: 'Annuité Calculée (A)',
                        type: 'calculated',
                        formula: 'capital * (tauxPeriodique * Math.pow(1 + tauxPeriodique, nombrePeriodes)) / (Math.pow(1 + tauxPeriodique, nombrePeriodes) - 1)',
                        calculatedFrom: ['capital', 'tauxPeriodique', 'nombrePeriodes'],
                        readonly: true
                    }
                ],
                color: '#8B5CF6',
            },
            {
                workflowTemplateId: cmtTemplate.id,
                stepOrder: 3,
                code: 'CMT_MISE_EN_PLACE',
                label: 'Mise en Place Crédit',
                description: 'Signature contrat et déblocage',
                requiredDocuments: ['Contrat de Prêt', 'Garanties', 'Tableau d\'Amortissement'],
                requiredFields: [
                    { name: 'dateDeblocage', label: 'Date de Déblocage', type: 'date', required: true }
                ],
                color: '#F59E0B',
            },
            {
                workflowTemplateId: cmtTemplate.id,
                stepOrder: 4,
                code: 'CMT_SUIVI',
                label: 'Suivi Échéances & Renouvellement',
                description: 'Suivi des remboursements périodiques',
                requiredFields: [
                    { name: 'prochaineEcheance', label: 'Prochaine Échéance', type: 'date', required: true },
                    { name: 'montantEcheance', label: 'Montant Échéance', type: 'number', required: true }
                ],
                color: '#6366F1',
            }
        ]
    });

    console.log('✅ Workflow templates seeded successfully!');
    console.log(`  - LC (Lettre de Crédit): ${lcTemplate.id}`);
    console.log(`  - AS (Avance sur Stock): ${asTemplate.id}`);
    console.log(`  - AF (Avance sur Facture): ${afTemplate.id}`);
    console.log(`  - RD (Remise Documentaire): ${rdTemplate.id}`);
    console.log(`  - CMT (Crédit Moyen Terme): ${cmtTemplate.id}`);
}

async function main() {
    try {
        await seedWorkflowTemplates();
    } catch (error) {
        console.error('Error seeding workflow templates:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
