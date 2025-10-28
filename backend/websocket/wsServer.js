// websocket/wsServer.js
import { Server } from "socket.io"
import { tankCache, loadTankCache } from "../services/configCache.js"
import { readAllProbes } from "../modbus/readAllProbes.js"
import { connectPort } from "../modbus/modbusClient.js"
import { formatTankData } from "../services/formatTankData.js"
import { writeTankData } from "../services/influxServices.js"

let lastPayloadStr = null
let pollingTimer = null
let isPolling = true // เปิดปิดการทำงานของรอบ polling
let isReading = false // true ขณะกำลังอ่าน (ป้องกันชนพอร์ต)

let lastInfluxWrite = 0
const INFLUX_INTERVAL = 5000 // 5 วิ

export const pausePolling = () => {
  isPolling = false
  console.log("⏸ Pause polling requested")
}

export const resumePolling = () => {
  isPolling = true
  console.log("▶ Resume polling")
}

export const waitPollingIdle = async (timeoutMs = 3000, tickMs = 25) => {
  const t0 = Date.now()
  while (isReading) {
    if (Date.now() - t0 > timeoutMs) {
      console.warn("⌛ waitPollingIdle timeout - continuing anyway")
      break
    }
    await new Promise((r) => setTimeout(r, tickMs))
  }
}

// -----------------------------
// initWebSocket (เหมือนเดิม, แค่เรียก loadTankCache ตอนเริ่ม)
// -----------------------------
export const initWebSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } })
  // let lastPayloadStr = null

  // โหลด cache ครั้งแรก
  ;(async () => {
    // 1. เชื่อมต่อ Modbus ก่อน
    await connectPort()

    // 2. โหลด config tank ก่อน
    await loadTankCache()
  })()

  console.log("✅ System ready. Starting polling...")

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id)
    if (lastPayloadStr) {
      socket.emit("tank_update", JSON.parse(lastPayloadStr))
    }
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id)
    })
  })

  pollingTimer = setInterval(async () => {
    try {
      if (!isPolling) return // ถูก pause จาก probe_config อยู่ ให้ข้าม
      if (tankCache.size === 0) return

      isReading = true // เริ่มอ่านจริง
      const rawArray = await readAllProbes()
      // console.log("rawArray :", rawArray)
      const formatted = []

      for (const raw of rawArray) {
        const info = tankCache.get(raw.probe_id)
        if (!info) continue
        formatted.push(formatTankData(raw, info))
      }

      // console.log("formatted :", formatted)
      console.log("Formatted ", formatted)
      console.log("Formatted type ", typeof formatted)
      // const mockFormatted = formatted.map((item) => {
      //   // สุ่มความสูงน้ำมัน (เช่น 0–1000 mm)
      //   const oilHeight = Math.random() * 1000;

      //   // volume สัมพันธ์กับความสูง (เชิงเส้น)
      //   // สมมุติว่าปริมาตรเต็มถังคือ capacity_l เมื่อ height = 1000 mm
      //   const oilVolume = (oilHeight / 1000) * item.capacity_l;

      //   // น้ำ (water) เปลี่ยนเล็กน้อย (0–20 mm)
      //   const waterHeight = Math.random() * 20;
      //   const waterVolume = waterHeight * 0.5; // สัมพันธ์กันนิดหน่อย

      //   // คำนวณเปอร์เซ็นต์ (จากความสูงน้ำมันเทียบกับ max)
      //   const fuelPercent = (oilHeight / 1000) * 100;
      //   const waterPercent = (waterHeight / 1000) * 100;

      //   return {
      //     tank_code: item.tank_code,
      //     tank_name: item.tank_name,
      //     fuel_name: item.fuel_name,
      //     fuel_color: item.fuel_color,
      //     capacity_l: item.capacity_l,

      //     oil_height: Number(oilHeight.toFixed(2)),
      //     oil_volume: Number(oilVolume.toFixed(2)),

      //     water_height: Number(waterHeight.toFixed(2)),
      //     water_volume: Number(waterVolume.toFixed(2)),

      //     fuel_percent: Number(fuelPercent.toFixed(2)),
      //     water_percent: Number(waterPercent.toFixed(2)),

      //     temp: Number((25 + Math.random() * 2 - 1).toFixed(1)), // ประมาณ 24–26°C
      //     status: "normal",
      //     timestamp: item.timestamp,
      //   };
      // });

      // ส่งไป front-end ทุก 1 วิ
      const payloadStr = JSON.stringify(formatted)

      // console.log("Payload Str :", payloadStr)
      // console.log("Payload data type :", typeof payloadStr)

      if (payloadStr !== lastPayloadStr) {
        io.emit("tank_update", formatted)
        lastPayloadStr = payloadStr
      }

      // เขียนลงใน influxDB ทุก 5 วิ
      const now = Date.now()
      if (now - lastInfluxWrite >= INFLUX_INTERVAL) {
        lastInfluxWrite = now
        for (const tank of formatted) {
          writeTankData(tank)
        }
      }
    } catch (err) {
      console.error("Polling error:", err.message)
    } finally {
      isReading = false //จบการอ่าน
    }
  }, 1000)
}
