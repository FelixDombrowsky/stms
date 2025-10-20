import { InfluxDB, Point } from "@influxdata/influxdb-client"
import dotenv from "dotenv"
dotenv.config()

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

if (!url || !token || !org || !bucket) {
  console.error("❌ InfluxDB config missing in .env")
}

const influxDB = new InfluxDB({ url, token })

const writeApi = influxDB.getWriteApi(org, bucket, "ms")

// เขียนข้อมูล 1 tank ลง influxDB จาก formatTankData
// ex. data : {tank_code, fuel_name, tank_type, probe_type, oil_height, water_height, oil_volume, water_volume,
//   fuel_percent, temp, status, timestamp}

export const writeTankData = (data) => {
  try {
    const point = new Point("tank_data") // measurement name
      // Tags (ควรเป็น string, ใช้ filter/ group ได้)
      .tag("tank_code", data.tank_code)
      .tag("fuel_name", data.fuel_name || "unknown")
      .tag("status", data.status)

      // Fields (ค่าตัวเลข / ค่าที่คำนวณ)
      .floatField("oil_height", data.oil_height || 0)
      .floatField("water_height", data.water_height || 0)
      .floatField("oil_volume", data.oil_volume || 0)
      .floatField("water_volume", data.water_volume || 0)
      .floatField("fuel_percent", data.fuel_percent || 0)
      .floatField("water_percent", data.water_percent || 0)
      .floatField("temp", data.temp || 0)
      .floatField("tank_capacity", data.capacity_l || 0)

      // timestamp
      .timestamp(new Date(data.timestamp))

    writeApi.writePoint(point)
  } catch (err) {
    console.error("❌ Influx Write Error:", err.message)
  }
}

export const closeInflux = async () => {
  try {
    await writeApi.close()
    console.log("✅ InfluxDB WriteAPI closed")
  } catch (err) {
    console.error("❌ Error closing InfluxDB WriteAPI:", err.message)
  }
}
