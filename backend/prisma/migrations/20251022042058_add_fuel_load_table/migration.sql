-- CreateTable
CREATE TABLE `fuel_load` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tank_code` VARCHAR(10) NOT NULL,
    `v_order` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `v_start` DECIMAL(12, 2) NOT NULL,
    `v_end` DECIMAL(12, 2) NOT NULL,
    `v_load` DECIMAL(12, 2) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fuel_load` ADD CONSTRAINT `fuel_load_tank_code_fkey` FOREIGN KEY (`tank_code`) REFERENCES `tank_setting`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
