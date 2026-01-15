-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerifiedAt` DATETIME(3) NULL,
    `failedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `companyId` VARCHAR(191) NULL,
    `businessUnitId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_status_idx`(`status`),
    INDEX `users_companyId_idx`(`companyId`),
    INDEX `users_businessUnitId_idx`(`businessUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banques` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `codeSwift` VARCHAR(191) NOT NULL,
    `codeGuichet` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `contactInfo` VARCHAR(191) NULL,
    `establishment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `banques_codeSwift_key`(`codeSwift`),
    INDEX `banques_codeSwift_idx`(`codeSwift`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `keyAccount` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `rib` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `deletedBy` VARCHAR(191) NULL,
    `banqueId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lignes_credit` (
    `id` VARCHAR(191) NOT NULL,
    `no` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `banqueId` VARCHAR(191) NOT NULL,
    `autorisationNo` VARCHAR(191) NOT NULL,
    `bankAccountNo` VARCHAR(191) NOT NULL,
    `montantPlafond` DOUBLE NOT NULL,
    `montantDevise` VARCHAR(191) NOT NULL,
    `taux` DOUBLE NOT NULL,
    `commitmentCommissionRate` DOUBLE NOT NULL,
    `estimatedOutstanding` DOUBLE NOT NULL,
    `consumption` DOUBLE NOT NULL,
    `outstanding` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `renewalDate` DATETIME(3) NULL,
    `statut` VARCHAR(191) NOT NULL,
    `responsibilityCenter` VARCHAR(191) NULL,
    `seuilAvanceSurStock` DOUBLE NOT NULL,
    `seuilAvanceSurFacture` DOUBLE NOT NULL,
    `seuilEscompte` DOUBLE NOT NULL,
    `seuilLC` DOUBLE NOT NULL,
    `seuilObligtDouane` DOUBLE NOT NULL,
    `seuilCautionAdmin` DOUBLE NOT NULL,
    `seuilDcvrtMobile` DOUBLE NOT NULL,
    `seuilTrsfrLibre` DOUBLE NOT NULL,
    `seuilLeasing` DOUBLE NOT NULL,
    `seuilCMT` DOUBLE NOT NULL,
    `seuilFraisMission` DOUBLE NOT NULL,
    `seuilLCAS` DOUBLE NOT NULL,
    `avanceSurStock` DOUBLE NOT NULL,
    `avanceFacture` DOUBLE NOT NULL,
    `escompte` DOUBLE NOT NULL,
    `obligatDouane` DOUBLE NOT NULL,
    `cautionAdmin` DOUBLE NOT NULL,
    `dcvrtMobile` DOUBLE NOT NULL,
    `trsfrLibre` DOUBLE NOT NULL,
    `leasing` DOUBLE NOT NULL,
    `CMT` DOUBLE NOT NULL,
    `fraisMission` DOUBLE NOT NULL,
    `LCAS` DOUBLE NOT NULL,
    `faciliteCaissier` DOUBLE NOT NULL,
    `typeFinancement` VARCHAR(191) NOT NULL,
    `maxConsumptionTolerance` DOUBLE NOT NULL,
    `minConsumptionTolerance` DOUBLE NOT NULL,
    `noSeries` VARCHAR(191) NOT NULL,
    `refinancing` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lignes_credit_no_key`(`no`),
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

-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `contactInfo` VARCHAR(191) NULL,
    `parentCompanyId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_code_key`(`code`),
    INDEX `companies_code_idx`(`code`),
    INDEX `companies_parentCompanyId_idx`(`parentCompanyId`),
    INDEX `companies_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_units` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `business_units_code_idx`(`code`),
    INDEX `business_units_companyId_idx`(`companyId`),
    INDEX `business_units_isActive_idx`(`isActive`),
    UNIQUE INDEX `business_units_code_companyId_key`(`code`, `companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `contactInfo` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `suppliers_code_key`(`code`),
    INDEX `suppliers_code_idx`(`code`),
    INDEX `suppliers_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_suppliers` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `company_suppliers_companyId_idx`(`companyId`),
    INDEX `company_suppliers_supplierId_idx`(`supplierId`),
    UNIQUE INDEX `company_suppliers_companyId_supplierId_key`(`companyId`, `supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_unit_suppliers` (
    `id` VARCHAR(191) NOT NULL,
    `businessUnitId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `business_unit_suppliers_businessUnitId_idx`(`businessUnitId`),
    INDEX `business_unit_suppliers_supplierId_idx`(`supplierId`),
    UNIQUE INDEX `business_unit_suppliers_businessUnitId_supplierId_key`(`businessUnitId`, `supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_banques` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `banqueId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `company_banques_companyId_idx`(`companyId`),
    INDEX `company_banques_banqueId_idx`(`banqueId`),
    UNIQUE INDEX `company_banques_companyId_banqueId_key`(`companyId`, `banqueId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    UNIQUE INDEX `roles_code_key`(`code`),
    INDEX `roles_code_idx`(`code`),
    INDEX `roles_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `resource` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NOT NULL DEFAULT 'all',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_name_key`(`name`),
    UNIQUE INDEX `permissions_code_key`(`code`),
    INDEX `permissions_code_idx`(`code`),
    INDEX `permissions_resource_idx`(`resource`),
    INDEX `permissions_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `businessUnitId` VARCHAR(191) NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedBy` VARCHAR(191) NULL,

    INDEX `user_roles_userId_idx`(`userId`),
    INDEX `user_roles_roleId_idx`(`roleId`),
    INDEX `user_roles_companyId_idx`(`companyId`),
    INDEX `user_roles_businessUnitId_idx`(`businessUnitId`),
    UNIQUE INDEX `user_roles_userId_roleId_companyId_businessUnitId_key`(`userId`, `roleId`, `companyId`, `businessUnitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `role_permissions_roleId_idx`(`roleId`),
    INDEX `role_permissions_permissionId_idx`(`permissionId`),
    UNIQUE INDEX `role_permissions_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_businessUnitId_fkey` FOREIGN KEY (`businessUnitId`) REFERENCES `business_units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_accounts` ADD CONSTRAINT `bank_accounts_banqueId_fkey` FOREIGN KEY (`banqueId`) REFERENCES `banques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_credit` ADD CONSTRAINT `lignes_credit_banqueId_fkey` FOREIGN KEY (`banqueId`) REFERENCES `banques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `garanties` ADD CONSTRAINT `garanties_ligneCreditId_fkey` FOREIGN KEY (`ligneCreditId`) REFERENCES `lignes_credit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagements` ADD CONSTRAINT `engagements_ligneCreditId_fkey` FOREIGN KEY (`ligneCreditId`) REFERENCES `lignes_credit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_parentCompanyId_fkey` FOREIGN KEY (`parentCompanyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_units` ADD CONSTRAINT `business_units_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_suppliers` ADD CONSTRAINT `company_suppliers_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_suppliers` ADD CONSTRAINT `company_suppliers_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_unit_suppliers` ADD CONSTRAINT `business_unit_suppliers_businessUnitId_fkey` FOREIGN KEY (`businessUnitId`) REFERENCES `business_units`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_unit_suppliers` ADD CONSTRAINT `business_unit_suppliers_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_banques` ADD CONSTRAINT `company_banques_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_banques` ADD CONSTRAINT `company_banques_banqueId_fkey` FOREIGN KEY (`banqueId`) REFERENCES `banques`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
