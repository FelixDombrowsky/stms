// websocket/wsServer.js
import { Server } from "socket.io"
import { tankCache, loadTankCache } from "../services/configCache.js"
import { readAllProbes } from "../modbus/readAllProbes.js"
import { connectPort } from "../modbus/modbusClient.js"
import { formatTankData } from "../services/formatTankData.js"

let lastPayloadStr = null
let pollingTimer = null
let isPolling = true // เปิดปิดการทำงานของรอบ polling
let isReading = false // true ขณะกำลังอ่าน (ป้องกันชนพอร์ต)

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

      // const dataWithoutTime = rawArray.map((d) => {
      //   const { timestamp, ...rest } = d
      //   return rest
      // })

      // แปลง rawArray เป็น string เพื่อเช็คการเปลี่ยนแปลง
      const payloadStr = JSON.stringify(formatted)

      if (payloadStr !== lastPayloadStr) {
        io.emit("tank_update", formatted)
        lastPayloadStr = payloadStr
      }
    } catch (err) {
      console.error("Polling error:", err.message)
    } finally {
      isReading = false //จบการอ่าน
    }
  }, 1000)
}
