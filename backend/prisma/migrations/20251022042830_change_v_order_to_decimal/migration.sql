/*
  Warnings:

  - You are about to alter the column `v_order` on the `fuel_load` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE `fuel_load` MODIFY `v_order` DECIMAL(12, 2) NOT NULL;
