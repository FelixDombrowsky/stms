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
    console.log("tank_data:", {
      tank_code: data.tank_code,
      timestamp: data.timestamp,
    })

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

export const getFuelLevel = async (req, res) => {
  try {
    const { tank_code, limit = 100000 } = req.query

    if (!tank_code) {
      return res.status(400).json({ message: "tank_code is required" })
    }

    const queryApi = influxDB.getQueryApi(org)

    // 🧠 Query InfluxQL (Flux Language)
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "tank_data")
        |> filter(fn: (r) => r.tank_code == "${tank_code}")
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> group(columns: ["tank_code"])
        |> sort(columns: ["_time"], desc: true)
    `

    const rows = []
    const start = Date.now()

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const data = tableMeta.toObject(row)
          const utcDate = new Date(data._time)
          const localTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000) // +7h
          const formattedLocalTime = localTime
            .toISOString()
            .replace("Z", "+07:00")
          // rows.push(data)
          rows.push({
            time: data._time,
            time_th: formattedLocalTime,
            oil_height: data.oil_height ?? 0,
            water_height: data.water_height ?? 0,
            oil_volume: data.oil_volume ?? 0,
            water_volume: data.water_volume ?? 0,
            fuel_percent: data.fuel_percent ?? 0,
            water_percent: data.water_percent ?? 0,
            temp: data.temp ?? 0,
            tank_capacity: data.tank_capacity ?? 0,
            status: data.status ?? "-",
          })
        },
        error(err) {
          console.error("❌ Influx Query Error:", err)
          reject(err)
        },
        complete() {
          console.log(`✅ Query completed in ${Date.now() - start}ms`)
          resolve()
        },
      })
    })

    return res.status(200).json(rows)
  } catch (err) {
    console.error("❌ getFuelLevel Error:", err.message)
    res.status(500).json({ message: "Read Influx Error", error: err.message })
  }
}

export const getFuelLevelByRange = async (req, res) => {
  try {
    const { start, end, tank_code } = req.query

    if (!start || !end || !tank_code) {
      return res
        .status(400)
        .json({ message: "start, end, and tankCode are required" })
    }

    const queryApi = influxDB.getQueryApi(org)

    // 🧠 Query ดึงเฉพาะค่าตอน start และ end
    const fluxQuery = `
      first_last = from(bucket: "${bucket}")
        |> range(start: time(v: "${start}"), stop: time(v: "${end}"))
        |> filter(fn: (r) => r._measurement == "tank_data")
        |> filter(fn: (r) => r.tank_code == "${tank_code}")
        |> group(columns: ["_field"])
        |> sort(columns: ["_time"], desc: false)

      data = union(tables: [first_last |> first(), first_last |> last()])
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> group(columns: ["tank_code"])
        |> sort(columns: ["_time"], desc: false)
        |> yield(name: "data")
    `

    const rows = []
    const startTime = Date.now()

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const data = tableMeta.toObject(row)
          const utcDate = new Date(data._time)
          const localTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000)
          const formattedLocalTime = localTime
            .toISOString()
            .replace("Z", "+07:00")

          rows.push({
            time: data._time,
            time_th: formattedLocalTime,
            oil_height: data.oil_height ?? 0,
            water_height: data.water_height ?? 0,
            oil_volume: data.oil_volume ?? 0,
            water_volume: data.water_volume ?? 0,
            fuel_percent: data.fuel_percent ?? 0,
            water_percent: data.water_percent ?? 0,
            temp: data.temp ?? 0,
            tank_capacity: data.tank_capacity ?? 0,
            status: data.status ?? "normal",
          })
        },
        error(err) {
          console.error("❌ Influx Query Error:", err)
          reject(err)
        },
        complete() {
          console.log(`✅ Query completed in ${Date.now() - startTime}ms`)
          resolve()
        },
      })
    })

    return res.status(200).json(rows)
  } catch (err) {
    console.error("❌ getFuelLevelByRange Error:", err.message)
    res.status(500).json({ message: "Read Influx Error", error: err.message })
  }
}
