import { PrismaClient } from '../identity/infrastructure/persistence/prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Workflow Templates for Financial Instruments
 * Based on Cahier des Charges - Solution Web de Gestion des Lignes de Crédit
 * 
 * Templates: LC, AS, AF, RD, CMT
 */

async function main() {
    console.log('🌱 Seeding Workflow Templates...');

    // ========================================
    // 1. LC - LETTRE DE CRÉDIT
    // ========================================
    console.log('\n📄 Creating LC - Lettre de Crédit Template...');

    const lcTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'LC' },
        update: {},
        create: {
            code: 'LC',
            label: 'Lettre de Crédit',
            description: 'Engagement irrévocable de la banque de payer le bénéficiaire si les documents contractuels sont présentés et conformes (UCP 600 / ISBP).',
            icon: 'CreditCard',
            color: '#3B82F6', // blue-500
            displayOrder: 1,
            formSchema: {
                fields: [
                    {
                        name: 'montant',
                        type: 'number',
                        label: 'Montant',
                        required: true,
                        min: 0,
                        step: 0.01,
                    },
                    {
                        name: 'devise',
                        type: 'select',
                        label: 'Devise',
                        required: true,
                        options: ['USD', 'EUR', 'DZD'],
                        defaultValue: 'USD',
                    },
                    {
                        name: 'fournisseurNom',
                        type: 'text',
                        label: 'Nom du Fournisseur',
                        required: true,
                    },
                    {
                        name: 'fournisseurAdresse',
                        type: 'textarea',
                        label: 'Adresse du Fournisseur',
                        required: true,
                    },
                    {
                        name: 'banqueId',
                        type: 'relation',
                        label: 'Banque Émettrice',
                        required: true,
                        relationTo: 'banques',
                    },
                    {
                        name: 'dateEcheance',
                        type: 'date',
                        label: "Date d'Échéance",
                        required: true,
                    },
                    {
                        name: 'incoterm',
                        type: 'select',
                        label: 'Incoterm',
                        required: true,
                        options: ['FOB', 'CIF', 'CFR', 'EXW', 'DDP'],
                    },
                    {
                        name: 'portDepartLoad',
                        type: 'text',
                        label: 'Port de Départ',
                        required: false,
                    },
                    {
                        name: 'portArrivee',
                        type: 'text',
                        label: "Port d'Arrivée",
                        required: false,
                    },
                ],
            },
            steps: {
                create: [
                    {
                        stepOrder: 1,
                        code: 'DEMANDE_LC',
                        label: 'Demande LC',
                        description: 'Initiation de la demande de lettre de crédit par le département Achats',
                        requiredFields: ['montant', 'devise', 'fournisseurNom', 'banqueId'],
                        requiredDocuments: ['PROFORMA', 'BON_COMMANDE'],
                        requiresApproval: false,
                        icon: 'FileText',
                        color: '#10B981', // green-500
                        allowedRoles: ['ACHATS', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 2,
                        code: 'VERIFICATION_DOC',
                        label: 'Vérifications Documentaires',
                        description: 'Contrôle de conformité des documents par le département Finance',
                        requiredDocuments: ['PROFORMA', 'BON_COMMANDE', 'FACTURE_PRO_FORMA'],
                        requiresApproval: false,
                        icon: 'FileSearch',
                        color: '#F59E0B', // amber-500
                        allowedRoles: ['FINANCE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 3,
                        code: 'APPROBATION_INTERNE',
                        label: 'Approbation Interne',
                        description: 'Validation par le comité crédit si montant > seuil',
                        requiresApproval: true,
                        approvalRoles: ['COMITE_CREDIT', 'FINANCE_MANAGER'],
                        icon: 'CheckCircle',
                        color: '#8B5CF6', // violet-500
                    },
                    {
                        stepOrder: 4,
                        code: 'EMISSION_SWIFT',
                        label: 'Émission SWIFT MT700',
                        description: 'Émission du message SWIFT MT700 et notification à la banque correspondante',
                        triggerAction: 'SEND_MT700',
                        requiredFields: ['montant', 'devise', 'dateEcheance', 'fournisseurNom'],
                        icon: 'Send',
                        color: '#06B6D4', // cyan-500
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 5,
                        code: 'RECEPTION_DOCS',
                        label: "Réception Documents d'Expédition",
                        description: "Réception des documents d'expédition par la banque",
                        requiredDocuments: ['BL', 'FACTURE_COMMERCIALE', 'CERTIFICAT_ORIGINE', 'PACKING_LIST'],
                        icon: 'Package',
                        color: '#EC4899', // pink-500
                    },
                    {
                        stepOrder: 6,
                        code: 'CONTROLE_ISBP',
                        label: 'Contrôle Documentaire ISBP',
                        description: 'Vérification conformité ISBP et décision de paiement',
                        requiresApproval: true,
                        approvalRoles: ['FINANCE_MANAGER', 'COMPLIANCE'],
                        icon: 'Shield',
                        color: '#EF4444', // red-500
                    },
                    {
                        stepOrder: 7,
                        code: 'PAIEMENT',
                        label: 'Paiement',
                        description: 'Déblocage paiement et mise à jour encours',
                        triggerAction: 'CREATE_AS_FROM_LC',
                        requiresApproval: true,
                        approvalRoles: ['TRESORERIE', 'FINANCE_MANAGER'],
                        icon: 'DollarSign',
                        color: '#22C55E', // green-500
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                ],
            },
        },
    });
    console.log(`✅ LC Template created with ${7} steps`);

    // ========================================
    // 2. AS - AVANCE SUR STOCK
    // ========================================
    console.log('\n📦 Creating AS - Avance sur Stock Template...');

    const asTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'AS' },
        update: {},
        create: {
            code: 'AS',
            label: 'Avance sur Stock',
            description: "Crédit court terme adossé à la valeur du stock d'articles importés ou détenus chez Condor.",
            icon: 'Package',
            color: '#10B981', // green-500
            displayOrder: 2,
            formSchema: {
                fields: [
                    {
                        name: 'montantDemande',
                        type: 'number',
                        label: 'Montant Demandé',
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'valeurStock',
                        type: 'number',
                        label: 'Valeur du Stock',
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'tauxPriseEnCharge',
                        type: 'number',
                        label: 'Taux de Prise en Charge (%)',
                        required: true,
                        min: 0,
                        max: 100,
                        defaultValue: 70,
                    },
                    {
                        name: 'banqueId',
                        type: 'relation',
                        label: 'Banque',
                        required: true,
                        relationTo: 'banques',
                    },
                    {
                        name: 'parentLCId',
                        type: 'text',
                        label: 'Référence LC Origine',
                        required: false,
                        helpText: 'Si AS créée automatiquement depuis LC',
                    },
                ],
            },
            steps: {
                create: [
                    {
                        stepOrder: 1,
                        code: 'RECEPTION_STOCK',
                        label: 'Réception Stock',
                        description: 'Réception et enregistrement du stock',
                        requiredDocuments: ['BL', 'FACTURE', 'BON_RECEPTION'],
                        icon: 'PackageCheck',
                        color: '#3B82F6',
                        allowedRoles: ['LOGISTIQUE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 2,
                        code: 'EVALUATION_STOCK',
                        label: 'Évaluation Stock',
                        description: "Calcul du montant éligible = valeur stock × taux prise en charge",
                        requiredFields: ['valeurStock', 'tauxPriseEnCharge'],
                        icon: 'Calculator',
                        color: '#F59E0B',
                        allowedRoles: ['FINANCE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 3,
                        code: 'APPROBATION_AS',
                        label: 'Approbation',
                        description: 'Validation de l\'avance sur stock',
                        requiresApproval: true,
                        approvalRoles: ['FINANCE_MANAGER'],
                        icon: 'CheckCircle',
                        color: '#8B5CF6',
                    },
                    {
                        stepOrder: 4,
                        code: 'DEBLOCAGE_FONDS',
                        label: 'Déblocage Fonds',
                        description: 'Déblocage des fonds par la banque',
                        requiresApproval: true,
                        approvalRoles: ['TRESORERIE'],
                        icon: 'DollarSign',
                        color: '#22C55E',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 5,
                        code: 'LIQUIDATION',
                        label: 'Liquidation',
                        description: "Liquidation de l'avance(remboursement)",
                        icon: 'CheckCircle2',
                        color: '#6B7280',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                ],
            },
        },
    });
    console.log(`✅ AS Template created with ${5} steps`);

    // ========================================
    // 3. AF - AVANCE SUR FACTURE
    // ========================================
    console.log('\n📄 Creating AF - Avance sur Facture Template...');

    const afTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'AF' },
        update: {},
        create: {
            code: 'AF',
            label: 'Avance sur Facture',
            description: 'Avance partielle sur une facture émise par Condor à un client (B2B), en attendant encaissement.',
            icon: 'Receipt',
            color: '#F59E0B', // amber-500
            displayOrder: 3,
            formSchema: {
                fields: [
                    {
                        name: 'numeroFacture',
                        type: 'text',
                        label: 'Numéro de Facture',
                        required: true,
                    },
                    {
                        name: 'montantFacture',
                        type: 'number',
                        label: 'Montant de la Facture',
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'montantAvance',
                        type: 'number',
                        label: "Montant de l'Avance",
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'pourcentageAvance',
                        type: 'number',
                        label: "Pourcentage d'Avance (%)",
                        required: true,
                        min: 0,
                        max: 100,
                        defaultValue: 80,
                    },
                    {
                        name: 'clientNom',
                        type: 'text',
                        label: 'Nom du Client',
                        required: true,
                    },
                    {
                        name: 'avecRecours',
                        type: 'boolean',
                        label: 'Avec Recours',
                        required: true,
                        defaultValue: true,
                    },
                    {
                        name: 'banqueId',
                        type: 'relation',
                        label: 'Banque',
                        required: true,
                        relationTo: 'banques',
                    },
                ],
            },
            steps: {
                create: [
                    {
                        stepOrder: 1,
                        code: 'DEPOT_FACTURE',
                        label: 'Dépôt Facture',
                        description: 'Dépôt de la facture client auprès de la banque',
                        requiredDocuments: ['FACTURE_CLIENT', 'BON_LIVRAISON'],
                        requiredFields: ['numeroFacture', 'montantFacture', 'clientNom'],
                        icon: 'Upload',
                        color: '#3B82F6',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 2,
                        code: 'VERIFICATION_SOLVABILITE',
                        label: 'Vérification Solvabilité',
                        description: 'Vérification de la solvabilité du débiteur',
                        requiresApproval: true,
                        approvalRoles: ['FINANCE_MANAGER', 'CREDIT_RISK'],
                        icon: 'UserCheck',
                        color: '#F59E0B',
                    },
                    {
                        stepOrder: 3,
                        code: 'AVANCE',
                        label: 'Avance',
                        description: "Déblocage de l'avance sur facture",
                        requiredFields: ['montantAvance', 'pourcentageAvance'],
                        requiresApproval: true,
                        approvalRoles: ['TRESORERIE'],
                        icon: 'DollarSign',
                        color: '#22C55E',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 4,
                        code: 'ENCAISSEMENT',
                        label: 'Encaissement',
                        description: 'Encaissement final de la facture client',
                        icon: 'CheckCircle',
                        color: '#10B981',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                ],
            },
        },
    });
    console.log(`✅ AF Template created with ${4} steps`);

    // ========================================
    // 4. RD - REMISE DOCUMENTAIRE
    // ========================================
    console.log('\n📋 Creating RD - Remise Documentaire Template...');

    const rdTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'RD' },
        update: {},
        create: {
            code: 'RD',
            label: 'Remise Documentaire',
            description: 'Remise des documents par la banque contre paiement (D/P) ou acceptation (D/A) sans engagement bancaire de paiement.',
            icon: 'FileText',
            color: '#8B5CF6', // violet-500
            displayOrder: 4,
            formSchema: {
                fields: [
                    {
                        name: 'montant',
                        type: 'number',
                        label: 'Montant',
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'devise',
                        type: 'select',
                        label: 'Devise',
                        required: true,
                        options: ['USD', 'EUR', 'DZD'],
                    },
                    {
                        name: 'typeRemise',
                        type: 'select',
                        label: 'Type de Remise',
                        required: true,
                        options: ['D/P', 'D/A'],
                        helpText: 'D/P = Documents contre Paiement, D/A = Documents contre Acceptation',
                    },
                    {
                        name: 'fournisseurNom',
                        type: 'text',
                        label: 'Nom du Fournisseur',
                        required: true,
                    },
                    {
                        name: 'banqueId',
                        type: 'relation',
                        label: 'Banque',
                        required: true,
                        relationTo: 'banques',
                    },
                ],
            },
            steps: {
                create: [
                    {
                        stepOrder: 1,
                        code: 'REMISE_DOCS',
                        label: 'Remise Documents',
                        description: 'Remise des documents commerciaux à la banque',
                        requiredDocuments: ['FACTURE_COMMERCIALE', 'BL', 'PACKING_LIST'],
                        requiredFields: ['montant', 'devise', 'typeRemise'],
                        icon: 'FileUp',
                        color: '#3B82F6',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 2,
                        code: 'PRESENTATION_BANQUE',
                        label: 'Présentation Banque',
                        description: 'Présentation des documents à la banque du tireur',
                        icon: 'Building2',
                        color: '#F59E0B',
                    },
                    {
                        stepOrder: 3,
                        code: 'PAIEMENT_ACCEPTATION',
                        label: 'Paiement / Acceptation',
                        description: 'Paiement ou acceptation selon le type de remise (D/P ou D/A)',
                        requiresApproval: true,
                        approvalRoles: ['FINANCE_MANAGER'],
                        icon: 'CheckCircle',
                        color: '#22C55E',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                ],
            },
        },
    });
    console.log(`✅ RD Template created with ${3} steps`);

    // ========================================
    // 5. CMT - CRÉDIT MOYEN TERME
    // ========================================
    console.log('\n💰 Creating CMT - Crédit Moyen Terme Template...');

    const cmtTemplate = await prisma.workflowTemplate.upsert({
        where: { code: 'CMT' },
        update: {},
        create: {
            code: 'CMT',
            label: 'Crédit Moyen Terme',
            description: 'Prêt amortissable (2–7 ans) destiné au financement d\'investissements matériels.',
            icon: 'TrendingUp',
            color: '#EF4444', // red-500
            displayOrder: 5,
            formSchema: {
                fields: [
                    {
                        name: 'montantTotal',
                        type: 'number',
                        label: 'Montant Total du Crédit',
                        required: true,
                        min: 0,
                    },
                    {
                        name: 'dureeAnnees',
                        type: 'number',
                        label: 'Durée (années)',
                        required: true,
                        min: 2,
                        max: 7,
                    },
                    {
                        name: 'tauxInteret',
                        type: 'number',
                        label: "Taux d'Intérêt Annuel (%)",
                        required: true,
                        min: 0,
                        max: 30,
                        step: 0.01,
                    },
                    {
                        name: 'typeAmortissement',
                        type: 'select',
                        label: "Type d'Amortissement",
                        required: true,
                        options: ['ANNUITE_CONSTANTE', 'AMORTISSEMENT_CONSTANT'],
                        defaultValue: 'ANNUITE_CONSTANTE',
                    },
                    {
                        name: 'objetInvestissement',
                        type: 'textarea',
                        label: "Objet de l'Investissement",
                        required: true,
                    },
                    {
                        name: 'banqueId',
                        type: 'relation',
                        label: 'Banque Prêteuse',
                        required: true,
                        relationTo: 'banques',
                    },
                ],
            },
            steps: {
                create: [
                    {
                        stepOrder: 1,
                        code: 'DEMANDE_CMT',
                        label: 'Demande CMT',
                        description: 'Dépôt de la demande de crédit moyen terme avec business plan',
                        requiredFields: ['montantTotal', 'dureeAnnees', 'tauxInteret', 'objetInvestissement'],
                        requiredDocuments: ['BUSINESS_PLAN', 'ETUDE_FAISABILITE'],
                        icon: 'FileText',
                        color: '#3B82F6',
                        allowedRoles: ['FINANCE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 2,
                        code: 'ETUDE_DOSSIER',
                        label: 'Étude Dossier',
                        description: 'Analyse du dossier par la banque et évaluation des garanties',
                        requiresApproval: false,
                        icon: 'FileSearch',
                        color: '#F59E0B',
                    },
                    {
                        stepOrder: 3,
                        code: 'APPROBATION_COMITE',
                        label: 'Approbation Comité',
                        description: 'Validation par le comité de crédit',
                        requiresApproval: true,
                        approvalRoles: ['COMITE_CREDIT', 'FINANCE_DIRECTOR'],
                        icon: 'Users',
                        color: '#8B5CF6',
                    },
                    {
                        stepOrder: 4,
                        code: 'DEBLOCAGE_CMT',
                        label: 'Déblocage Fonds',
                        description: 'Déblocage du crédit moyen terme',
                        requiresApproval: true,
                        approvalRoles: ['FINANCE_DIRECTOR'],
                        icon: 'DollarSign',
                        color: '#22C55E',
                        allowedRoles: ['TRESORERIE', 'SUPER_ADMIN'],
                    },
                    {
                        stepOrder: 5,
                        code: 'AMORTISSEMENT',
                        label: 'Amortissement',
                        description: 'Suivi du tableau d\'amortissement et échéances',
                        triggerAction: 'GENERATE_AMORTIZATION_SCHEDULE',
                        icon: 'Calendar',
                        color: '#06B6D4',
                        allowedRoles: ['TRESORERIE', 'FINANCE', 'SUPER_ADMIN'],
                    },
                ],
            },
        },
    });
    console.log(`✅ CMT Template created with ${5} steps`);

    console.log('\n✅ All 5 Workflow Templates seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - LC (Lettre de Crédit): 7 steps`);
    console.log(`   - AS (Avance sur Stock): 5 steps`);
    console.log(`   - AF (Avance sur Facture): 4 steps`);
    console.log(`   - RD (Remise Documentaire): 3 steps`);
    console.log(`   - CMT (Crédit Moyen Terme): 5 steps`);
    console.log(`   Total: 24 workflow steps`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding workflow templates:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
