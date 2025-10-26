/*
  Warnings:

  - Added the required column `h1_auto` to the `fuel_load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `h2_auto` to the `fuel_load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `v1_auto` to the `fuel_load` table without a default value. This is not possible if the table is not empty.
  - Added the required column `v2_auto` to the `fuel_load` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fuel_load` ADD COLUMN `h1_auto` DECIMAL(12, 2) NOT NULL,
    ADD COLUMN `h2_auto` DECIMAL(12, 2) NOT NULL,
    ADD COLUMN `v1_auto` DECIMAL(12, 2) NOT NULL,
    ADD COLUMN `v2_auto` DECIMAL(12, 2) NOT NULL;
