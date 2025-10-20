import { InfluxDB, Point } from "@influxdata/influxdb-client";

const url = "http://localhost:8086";
const org = "stms_org";
const bucket = "fuel_level_data";
const token =
  "XQqONf2Z9huolYHrlhf328W34fsaxrkeNXEuieb1VBtOf_Bej0pkbq9FJGGnyQdkT_LC6KYZbjTiJlYB4dL36w==";

const TANK_CODE = "001";

const influxDB = new InfluxDB({ url, token });

const writeApi = influxDB.getWriteApi(org, bucket, "ns");

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomStatus = (percent) => {
  if (percent > 90) return "high_alarm";
  if (percent > 80) return "high_alert";
  if (percent < 10) return "low_alarm";
  return "normal";
};

const mockDataOnce = () => {
  const capacity = 30000;

  const fuel_volume = Math.round(randomInRange(5000, 29000));
  const fuel_percent = (fuel_volume / capacity) * 100;
  const fuel_height = randomInRange(100, 2000);

  const water_volume = randomInRange(0, 500);

  const water_height = randomInRange(0, 200);

  const temp = randomInRange(25, 40);
  const status = getRandomStatus(fuel_percent);

  const point = new Point("fuel_level_test")
    .tag("tank_code", TANK_CODE)
    .floatField("fuel_volume", fuel_volume)
    .floatField("fuel_percent", fuel_percent)
    .floatField("fuel_height", fuel_height)
    .floatField("water_volume", water_volume)
    .floatField("water_height", water_height) // ✅ ที่ขอเพิ่ม
    .floatField("temp", temp)
    .stringField("status", status);

  writeApi.writePoint(point);

  console.log(`✅ Wrote to Influx => tank ${TANK_CODE}`, {
    fuel_volume,
    fuel_percent: fuel_percent.toFixed(2),
    fuel_height,
    water_volume,
    water_height,
    temp: temp.toFixed(2),
    status,
  });
};

// ----- RUN EVERY 5 SECONDS -----
setInterval(mockDataOnce, 5000);

// ถ้าโปรแกรมจะปิด ให้ flush ให้เรียบร้อย
process.on("SIGINT", async () => {
  console.log("🛑 Flushing data before exit...");
  await writeApi.close();
  console.log("✅ Done. Exiting.");
  process.exit(0);
});
