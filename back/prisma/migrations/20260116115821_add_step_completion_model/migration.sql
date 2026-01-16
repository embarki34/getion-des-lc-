-- CreateTable
CREATE TABLE `step_completions` (
    `id` VARCHAR(191) NOT NULL,
    `engagementId` VARCHAR(191) NOT NULL,
    `workflowStepId` VARCHAR(191) NOT NULL,
    `completedBy` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fieldData` TEXT NULL,
    `documents` TEXT NULL,
    `notes` TEXT NULL,

    INDEX `step_completions_engagementId_idx`(`engagementId`),
    INDEX `step_completions_workflowStepId_idx`(`workflowStepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `step_completions` ADD CONSTRAINT `step_completions_engagementId_fkey` FOREIGN KEY (`engagementId`) REFERENCES `engagements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `step_completions` ADD CONSTRAINT `step_completions_workflowStepId_fkey` FOREIGN KEY (`workflowStepId`) REFERENCES `workflow_steps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
