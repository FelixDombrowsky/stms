/*
  Warnings:

  - You are about to drop the column `density` on the `fuel_type` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fuel_name` ADD COLUMN `density` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `fuel_type` DROP COLUMN `density`,
    ADD COLUMN `description` TEXT NULL;
