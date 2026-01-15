-- CreateTable
CREATE TABLE `banques` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `codeSwift` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `contactInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `banques_codeSwift_key`(`codeSwift`),
    INDEX `banques_codeSwift_idx`(`codeSwift`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lignes_credit` (
    `id` VARCHAR(191) NOT NULL,
    `banqueId` VARCHAR(191) NOT NULL,
    `montantPlafond` DOUBLE NOT NULL,
    `devise` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `typeFinancement` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `lignes_credit_banqueId_idx`(`banqueId`),
    INDEX `lignes_credit_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `garanties` (
    `id` VARCHAR(191) NOT NULL,
    `ligneCreditId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `dateExpiration` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `garanties_ligneCreditId_idx`(`ligneCreditId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engagements` (
    `id` VARCHAR(191) NOT NULL,
    `ligneCreditId` VARCHAR(191) NOT NULL,
    `typeFinancement` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `devise` VARCHAR(191) NOT NULL,
    `dateEngagement` DATETIME(3) NOT NULL,
    `dateEcheance` DATETIME(3) NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `referenceDossier` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `engagements_ligneCreditId_idx`(`ligneCreditId`),
    INDEX `engagements_statut_idx`(`statut`),
    INDEX `engagements_referenceDossier_idx`(`referenceDossier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swift_messages` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `referenceDossier` VARCHAR(191) NOT NULL,
    `dateGeneration` DATETIME(3) NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `swift_messages_referenceDossier_idx`(`referenceDossier`),
    INDEX `swift_messages_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents_import` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `nomFichier` VARCHAR(191) NOT NULL,
    `cheminFichier` VARCHAR(191) NOT NULL,
    `dateUpload` DATETIME(3) NOT NULL,
    `metadata` TEXT NULL,
    `referenceDossier` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `documents_import_referenceDossier_idx`(`referenceDossier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lignes_credit` ADD CONSTRAINT `lignes_credit_banqueId_fkey` FOREIGN KEY (`banqueId`) REFERENCES `banques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `garanties` ADD CONSTRAINT `garanties_ligneCreditId_fkey` FOREIGN KEY (`ligneCreditId`) REFERENCES `lignes_credit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagements` ADD CONSTRAINT `engagements_ligneCreditId_fkey` FOREIGN KEY (`ligneCreditId`) REFERENCES `lignes_credit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
