-- Probe Type
CREATE TABLE probe_type (
    probe_type_id INT AUTO_INCREMENT PRIMARY KEY,   -- Primary Key, รันอัตโนมัติ
    probe_type_name VARCHAR(50) NOT NULL            -- ชื่อประเภท เช่น "MAGNETOSTRICTIVE"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Probe Setting
CREATE TABLE probe_setting (
    probe_id INT AUTO_INCREMENT PRIMARY KEY,
    probe_type_id INT,
    oil_h_address INT,
    oil_h_scale DOUBLE,
    water_h_address INT,
    water_h_scale DOUBLE,
    temp_address INT,
    temp_scale DOUBLE,
    format VARCHAR(20),
    function_code VARCHAR(10),
    address_length INT,

    CONSTRAINT fk_probe_type
        FOREIGN KEY (probe_type_id)
        REFERENCES probe_type(probe_type_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fuel Type
CREATE TABLE fuel_type (
    fuel_type_code VARCHAR(10) PRIMARY KEY,
    fuel_type_name VARCHAR(50) NOT NULL,
    density DECIMAL(10,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fuel Name
CREATE TABLE fuel_name (
    fuel_code VARCHAR(10) PRIMARY KEY,
    fuel_name VARCHAR(50) NOT NULL,
    fuel_type_code VARCHAR(10) NOT NULL,
    description TEXT,
    fuel_color VARCHAR(50),

    CONSTRAINT fk_fuel_type
        FOREIGN KEY (fuel_type_code)
        REFERENCES fuel_type(fuel_type_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tank Setting
CREATE TABLE tank_setting (
    code VARCHAR(10) PRIMARY KEY,              -- เช่น 'T001', 'TK-A1'
    tank_name VARCHAR(100) NOT NULL,           -- ชื่อถัง (อ่านง่าย)

    probe_id INT NOT NULL,                     -- FK -> probe_setting(probe_id)
    fuel_code VARCHAR(10) NOT NULL,            -- FK -> fuel_name(fuel_code)

    capacity_l DECIMAL(12,2),                  -- ความจุ (ลิตร)
    tank_type INT,                             -- ประเภทถัง (เช่น 1=horizontal, 2=vertical)

    vertical_mm DECIMAL(12,2),                 -- ความสูงแนวตั้ง (mm)
    horizontal_mm DECIMAL(12,2),               -- ความกว้างแนวนอน (mm)
    length_mm DECIMAL(12,2),                   -- ความยาว (mm)

    cal_capacity_l DECIMAL(12,2),              -- ความจุคำนวณได้
    comp_oil_mm DECIMAL(12,2),                 -- compensation oil (mm)
    comp_water_mm DECIMAL(12,2),               -- compensation water (mm)

    high_alarm_l DECIMAL(12,2),                -- เตือนน้ำมันสูง
    high_alert_l DECIMAL(12,2),                -- เตือนเตรียมน้ำมันสูง
    low_alarm_l DECIMAL(12,2),                 -- เตือนน้ำมันต่ำ
    water_high_alarm_l DECIMAL(12,2),          -- เตือนน้ำสูง

    auto_status INT DEFAULT 0 COMMENT '0 = OFF, 1 = ON'  -- สถานะ AUTO Calibrate (0=off, 1=on)

    CONSTRAINT fk_probe_setting
        FOREIGN KEY (probe_id)
        REFERENCES probe_setting(probe_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,                    -- restrict คือห้ามลบ primary key หาก foreignkey ใช้อยู่

    CONSTRAINT fk_fuel_name
        FOREIGN KEY (fuel_code)
        REFERENCES fuel_name(fuel_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

