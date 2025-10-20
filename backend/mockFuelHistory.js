// mockFuelHistory.js
// สร้างข้อมูลย้อนหลัง 3 เดือน ทุก 5 วินาที แบบสมจริง แล้วเขียนแบบ batch ลง InfluxDB v2

import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

/**
 * ---------- CONFIG ----------
 * ใช้ .env หรือแก้ค่าด้านล่างได้
 * INFLUX_URL=http://localhost:8086
 * INFLUX_ORG=stms_org
 * INFLUX_BUCKET=fuel_level_data
 * INFLUX_TOKEN=your_token_here
 */
const url = process.env.INFLUX_URL || "http://localhost:8086";
const org = process.env.INFLUX_ORG || "stms_org";
const bucket = process.env.INFLUX_BUCKET || "fuel_level_data";
const token =
  "XQqONf2Z9huolYHrlhf328W34fsaxrkeNXEuieb1VBtOf_Bej0pkbq9FJGGnyQdkT_LC6KYZbjTiJlYB4dL36w=="; // ต้องใช้ token (v2 ต้อง auth ด้วย token)

const MEAS = "fuel_level_test";
const TANK_CODE = "001";

// เวลา/จำนวนจุด
const STEP_SEC = 5; // ทุก 5 วินาที (ตามที่ขอ)
const DURATION_DAYS = 90; // 3 เดือน ~ 90 วัน
const NOW = Date.now();
const START = NOW - DURATION_DAYS * 24 * 60 * 60 * 1000;
const STEP_MS = STEP_SEC * 1000;

// คุณสมบัติถัง (สมมติ)
const CAPACITY_L = 30000;
const HEIGHT_MM = 2000; // สูงถังแบบคร่าว ๆ (เอาไว้คำนวณ fuel_height linear)
const WATER_MAX_L = 600; // เพดานน้ำ
const WATER_MAX_MM = 200;

// Write options
const influxDB = new InfluxDB({ url, token });
// ใช้ ns precision, และลด batchSize เพื่อกันเมมพุ่ง/เพิ่มความเสถียร
const writeApi = influxDB.getWriteApi(org, bucket, "ns", {
  batchSize: 5000,
  flushInterval: 5000, // ms
  maxBufferLines: 30000,
});

/** ---------- Helpers ---------- */

// สุ่มในช่วง
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// สถานะตามเปอร์เซ็นต์
const statusFromPercent = (p) => {
  if (p > 90) return "high_alarm";
  if (p > 80) return "high_alert";
  if (p < 10) return "low_alarm";
  return "normal";
};

// อุณหภูมิรายวัน: กลางวันสูง กลางคืนต่ำ (ซายน์เวฟ + noise)
const tempAtTimestamp = (ts) => {
  const d = new Date(ts);
  const hour = d.getHours() + d.getMinutes() / 60;
  // สวิงจาก 26 → 40 องศา
  const base = 33 + 7 * Math.sin(((hour - 12) / 24) * 2 * Math.PI); // peak @ ~บ่าย
  return clamp(base + rand(-1, 1), 25, 42);
};

// อัตราการใช้เชื้อเพลิงต่อวินาทีตามช่วงเวลา (ลิตร/วินาที)
const consumptionRateLps = (ts) => {
  const h = new Date(ts).getHours();
  // กลางวัน 6-22 ใช้มากกว่า กลางคืนใช้น้อย
  if (h >= 6 && h < 22) {
    return rand(0.02, 0.06); // 72–216 L/h
  }
  return rand(0.005, 0.02); // 18–72 L/h กลางคืน
};

// สุ่มเหตุการณ์เติมน้ำมันเป็นครั้งคราว
// คืนปริมาณลิตรที่เติม ณ เวลานั้น (อาจเป็น 0 ถ้าไม่เติม)
// โอกาสเติม ~ ทุก 2-4 วัน/ครั้ง ปริมาณ 20–60% ของความจุ
const refillEventLiters = (ts, lastRefillTs) => {
  const daysSince = (ts - lastRefillTs) / (1000 * 60 * 60 * 24);
  if (daysSince < 2) return 0;
  // โอกาสเล็กน้อยในแต่ละสเต็ป ถ้าห่าง >2 วัน
  if (Math.random() < 0.0005) {
    return rand(0.2 * CAPACITY_L, 0.6 * CAPACITY_L);
  }
  return 0;
};

// น้ำ (volume/height) ค่อย ๆ สวิง/เพิ่มเล็กน้อย
const nextWater = (prevVolume, prevHeight) => {
  let vol = clamp(prevVolume + rand(-5, 15), 0, WATER_MAX_L);
  let h = clamp(prevHeight + rand(-2, 2), 0, WATER_MAX_MM);
  return [vol, h];
};

/** ---------- Main Backfill ---------- */
async function run() {
  if (!token) {
    console.error(
      "❌ INFLUX_TOKEN ไม่ถูกตั้งค่าใน .env — ต้องมี token สำหรับ InfluxDB v2"
    );
    process.exit(1);
  }

  console.log("🚀 Start backfill:");
  console.log(
    `- Range: ${new Date(START).toISOString()} → ${new Date(NOW).toISOString()}`
  );
  console.log(`- Step: ${STEP_SEC}s, Days: ${DURATION_DAYS}`);
  console.log(
    `- Approx points: ~${Math.floor(
      (NOW - START) / STEP_MS
    ).toLocaleString()} points`
  );

  // ค่าเริ่มต้น
  let ts = START;
  let fuelVolume = rand(0.4 * CAPACITY_L, 0.8 * CAPACITY_L);
  let waterVolume = rand(50, 200);
  let waterHeight = (waterVolume / WATER_MAX_L) * WATER_MAX_MM;
  let lastRefillTs = START - 4 * 24 * 60 * 60 * 1000; // ให้มีโอกาสเติมได้ตั้งแต่ต้น

  // สร้างเป็น batch แล้วค่อย flush เป็นระยะ
  const BATCH_LINES = 10000;
  let written = 0;
  let buffered = 0;

  try {
    for (; ts <= NOW; ts += STEP_MS) {
      // คำนวณการใช้งาน
      const dL = consumptionRateLps(ts) * STEP_SEC;
      fuelVolume = clamp(fuelVolume - dL, 0, CAPACITY_L);

      // โอกาสเติมน้ำมัน
      const refillL = refillEventLiters(ts, lastRefillTs);
      if (refillL > 0) {
        fuelVolume = clamp(fuelVolume + refillL, 0, CAPACITY_L);
        lastRefillTs = ts;
      }

      // น้ำ
      [waterVolume, waterHeight] = nextWater(waterVolume, waterHeight);

      // ค่าที่เหลือ
      const fuelPercent = (fuelVolume / CAPACITY_L) * 100;
      const fuelHeight = (fuelVolume / CAPACITY_L) * HEIGHT_MM; // approx. linear
      const temp = tempAtTimestamp(ts);
      const status = statusFromPercent(fuelPercent);

      const p = new Point(MEAS)
        .tag("tank_code", TANK_CODE)
        .floatField("fuel_volume", fuelVolume)
        .floatField("fuel_percent", fuelPercent)
        .floatField("fuel_height", fuelHeight)
        .floatField("water_volume", waterVolume)
        .floatField("water_height", waterHeight)
        .floatField("temp", temp)
        .stringField("status", status)
        .timestamp(new Date(ts)); // ให้เป็นเวลาย้อนหลัง

      writeApi.writePoint(p);
      buffered++;
      written++;

      // แสดง progress บ้าง
      if (written % 50000 === 0) {
        console.log(
          `... progress: ${written.toLocaleString()} points @ ${new Date(
            ts
          ).toISOString()}`
        );
      }

      // ช่วยบังคับ flush เป็นระยะ ๆ กันบัฟเฟอร์โตเกิน
      if (buffered >= BATCH_LINES) {
        await writeApi.flush();
        buffered = 0;
      }
    }

    // flush ท้ายสุด
    await writeApi.close();
    console.log(
      `✅ Backfill done. Total written: ~${written.toLocaleString()} points`
    );
  } catch (err) {
    console.error("❌ Backfill error:", err);
    try {
      await writeApi.close();
    } catch (e2) {
      console.error("❌ Error on closing writeApi:", e2);
    }
    process.exit(1);
  }
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Fatal:", e);
    process.exit(1);
  });
