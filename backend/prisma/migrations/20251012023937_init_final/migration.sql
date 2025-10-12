-- CreateTable
CREATE TABLE `probe_type` (
    `probe_type_id` INTEGER NOT NULL,
    `probe_type_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`probe_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `probe_setting` (
    `probe_id` INTEGER NOT NULL,
    `probe_type_id` INTEGER NULL,
    `oil_h_address` INTEGER NULL,
    `oil_h_scale` DOUBLE NULL,
    `water_h_address` INTEGER NULL,
    `water_h_scale` DOUBLE NULL,
    `temp_address` INTEGER NULL,
    `temp_scale` DOUBLE NULL,
    `format` VARCHAR(20) NULL,
    `function_code` VARCHAR(10) NULL,
    `address_length` INTEGER NULL DEFAULT 2,

    PRIMARY KEY (`probe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_type` (
    `fuel_type_code` VARCHAR(10) NOT NULL,
    `fuel_type_name` VARCHAR(50) NOT NULL,
    `density` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`fuel_type_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_name` (
    `fuel_code` VARCHAR(10) NOT NULL,
    `fuel_name` VARCHAR(50) NOT NULL,
    `fuel_type_code` VARCHAR(10) NOT NULL,
    `description` TEXT NULL,
    `fuel_color` VARCHAR(50) NULL,

    PRIMARY KEY (`fuel_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tank_setting` (
    `code` VARCHAR(10) NOT NULL,
    `tank_name` VARCHAR(100) NOT NULL,
    `probe_id` INTEGER NOT NULL,
    `fuel_code` VARCHAR(10) NOT NULL,
    `capacity_l` DECIMAL(12, 2) NULL,
    `tank_type` INTEGER NULL,
    `vertical_mm` DECIMAL(12, 2) NULL,
    `horizontal_mm` DECIMAL(12, 2) NULL,
    `length_mm` DECIMAL(12, 2) NULL,
    `cal_capacity_l` DECIMAL(12, 2) NULL,
    `comp_oil_mm` DECIMAL(12, 2) NULL,
    `comp_water_mm` DECIMAL(12, 2) NULL,
    `high_alarm_l` DECIMAL(12, 2) NULL,
    `high_alert_l` DECIMAL(12, 2) NULL,
    `low_alarm_l` DECIMAL(12, 2) NULL,
    `water_high_alarm_l` DECIMAL(12, 2) NULL,
    `auto_status` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `probe_setting` ADD CONSTRAINT `probe_setting_probe_type_id_fkey` FOREIGN KEY (`probe_type_id`) REFERENCES `probe_type`(`probe_type_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fuel_name` ADD CONSTRAINT `fuel_name_fuel_type_code_fkey` FOREIGN KEY (`fuel_type_code`) REFERENCES `fuel_type`(`fuel_type_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tank_setting` ADD CONSTRAINT `tank_setting_probe_id_fkey` FOREIGN KEY (`probe_id`) REFERENCES `probe_setting`(`probe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tank_setting` ADD CONSTRAINT `tank_setting_fuel_code_fkey` FOREIGN KEY (`fuel_code`) REFERENCES `fuel_name`(`fuel_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
