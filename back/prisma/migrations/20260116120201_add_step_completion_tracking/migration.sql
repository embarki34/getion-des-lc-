/*
  Warnings:

  - You are about to drop the column `templateId` on the `workflow_steps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workflowTemplateId,stepOrder]` on the table `workflow_steps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workflowTemplateId` to the `workflow_steps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `workflow_steps` DROP FOREIGN KEY `workflow_steps_templateId_fkey`;

-- DropIndex
DROP INDEX `workflow_steps_templateId_stepOrder_key` ON `workflow_steps`;

-- AlterTable
ALTER TABLE `workflow_steps` DROP COLUMN `templateId`,
    ADD COLUMN `workflowTemplateId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `workflow_steps_workflowTemplateId_idx` ON `workflow_steps`(`workflowTemplateId`);

-- CreateIndex
CREATE UNIQUE INDEX `workflow_steps_workflowTemplateId_stepOrder_key` ON `workflow_steps`(`workflowTemplateId`, `stepOrder`);

-- AddForeignKey
ALTER TABLE `workflow_steps` ADD CONSTRAINT `workflow_steps_workflowTemplateId_fkey` FOREIGN KEY (`workflowTemplateId`) REFERENCES `workflow_templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
