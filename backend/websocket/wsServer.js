// websocket/wsServer.js
import { Server } from "socket.io"
import { tankCache, loadTankCache } from "../services/configCache.js"
import { readAllProbes } from "../modbus/readAllProbes.js"
import { connectPort } from "../modbus/modbusClient.js"
import { formatTankData } from "../services/formatTankData.js"

// -----------------------------
// initWebSocket (เหมือนเดิม, แค่เรียก loadTankCache ตอนเริ่ม)
// -----------------------------
export const initWebSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } })
  let lastPayloadStr = null

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

  setInterval(async () => {
    try {
      if (tankCache.size === 0) return

      const rawArray = await readAllProbes()
      // console.log("rawArray :", rawArray)
      const formatted = []

      for (const raw of rawArray) {
        const info = tankCache.get(raw.probe_id)
        if (!info) continue
        formatted.push(formatTankData(raw, info))
      }

      // แปลง rawArray เป็น string เพื่อเช็คการเปลี่ยนแปลง
      const payloadStr = JSON.stringify(formatted)

      if (payloadStr !== lastPayloadStr) {
        io.emit("tank_update", formatted)
        lastPayloadStr = payloadStr
      }
    } catch (err) {
      console.error("Polling error:", err.message)
    }
  }, 1000)
}
