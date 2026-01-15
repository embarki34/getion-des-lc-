/*
  Warnings:

  - You are about to drop the column `operationDate` on the `lignes_credit` table. All the data in the column will be lost.
  - You are about to drop the column `operationType` on the `lignes_credit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lignes_credit` DROP COLUMN `operationDate`,
    DROP COLUMN `operationType`;
