import { WebSocketServer } from "ws"
import { Server } from "socket.io"
// import { readAllProbes } from "../modbus/readAllProbe.js"
// import { formatTankData } from "../services/formatTankData.js"

import prisma from "../db.js"

// export const initWebSocket = (server) => {
//   const wss = new WebSocketServer({ server })
let tankCache = new Map()

async function loadTankCache() {
  const tanks = await prisma.tank_setting.findMany({
    include: {
      fuel_name: true,
      probe_setting: true,
    },
  })

  // ล้างของเก่า
  tankCache.clear()

  // ใส่ข้อมูลใหม่ (map ตาม probe_id)
  for (const t of tanks) {
    tankCache.set(t.probe_id, t)
  }

  console.log("✅ Tank cache loaded. size =", tankCache.size)
}

export const initWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // หรือใส่ http://localhost:3000
    },
  })

  ;(async () => {
    await loadTankCache() // ✅ ไม่ต้อง assign ให้ tankCache อีก
    console.log(`tankCache :`, tankCache)
  })().catch((err) => console.error("Tank cache load error:", err))

  let lastPayloadStr = null

  // เพิ่งเข้า
  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id)

    // ส่งค่าเดิมทันทีถ้ามี user ใหม่เข้ามา
    if (lastPayloadStr) {
      socket.emit("tank_update", JSON.parse(lastPayloadStr))
    }

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id)
    })
  })

  // Poll sensor ทุก 1 วิ
  setInterval(async () => {
    try {
      // 1. อ่านค่าจากทุก probe
      // const rawArray = await readAllProbes()
      // console.log("Raw Array:", rawArray)
      // 2. format ทุกตัวด้วย formatTankData()
      // const formattedArray = rawArray.map(formatTankData)
      // 3. เช็คว่าข้อมูลเปลี่ยนไปจากรอบก่อนหน้าไหม
      // const payloadStr = JSON.stringify(formattedArray)
      // if (payloadStr !== lastPayloadStr) {
      //   io.emit("tank_update", formattedArray) // ส่งให้ทุก client
      //   lastPayloadStr = payloadStr
      //   console.log("Sent update:", formattedArray)
      // }
    } catch (error) {
      console.error("❌ Polling error :", error.message)
    }
  }, 1000)
}

//   // 1.Connection -> ทำงานเมื่อ client เชื่อมต่อเข้ามาครั้งแรก
//   wss.on("connection", (ws) => {
//     console.log("Client Connected")
//     //ส่งให้ client คนที่เชื่อมต่อเท่านั้น
//     ws.send(JSON.stringify({ type: "WELCOME", message: "Hi new client" }))

//     // 2.ทำงานเมื่อ Client ส่งข้อความมาหา server
//     ws.on("message", (data) => {
//       const msg = JSON.parse(data)
//       console.log("Received:", msg)

//       // ส่งกลับเฉพาะคนที่ส่งมา
//       ws.send(JSON.stringify({ type: "REPLY", message: "Got your message" }))

//       // ส่งประกาศให้ทุกคนรู้ว่ามีข้อความใหม่
//       wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//           client.send(JSON.stringify({ type: "BROADCAST", message: msg }))
//         }
//       })
//     })

//     // 3.ทำงงานเมื่อ Client ปิดการเชื่อมต่อ (เปลี่ยนหน้าเว็บ)
//     ws.on("close", () => {
//       console.log("Client disconnected")
//     })
//   })
// }

// ทดสอบส่งข้อมูลทุก 2 วิ
// setInterval(() => {
//   socket.emit("tank_update", {
//     tank_code: "T01",
//     fuel_volume: Math.random() * 5000,
//     fuel_percent: Math.random() * 100,
//     status: "normal",
//   })
// }, 5000)
