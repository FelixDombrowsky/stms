import ModbusRTU from "modbus-serial"
import dotenv from "dotenv"
dotenv.config()

// CONFIG
const SERIAL_PORT =
  process.platform === "win32"
    ? process.env.MODBUS_PORT
    : process.env.MODBUS_PORT_LINUX

const BAUD_RATE = Number(process.env.BAUD_RATE || 9600)
const TIMEOUT_MS = Number(process.env.MODBUS_TIMEOUT || 1000)

// STATE
let client = null
let connected = false
let isReconnecting = false
let status = "no_port" // "no_port" | "reconnecting" | "normal"

// UPDATE STATUS HELPER
const setStatus = (newStatus) => {
  if (status !== newStatus) {
    status = newStatus
    console.log(`📡 Modbus Status => ${newStatus}`)
  }
}

// CONNECT FUNCTION (Main)
export const connectPort = async () => {
  if (isReconnecting) return
  isReconnecting = true
  setStatus("reconnecting")

  try {
    // ปิด client เดิมถ้ายังเปิดอยู่
    if (client && client.isOpen) {
      await new Promise((resolve) => client.close(resolve))
      console.log("🔻 Closed old port")
    }

    // สร้าง client ใหม่
    client = new ModbusRTU()

    console.log(`🔌 Connecting to ${SERIAL_PORT} @${BAUD_RATE}...`)
    await client.connectRTUBuffered(SERIAL_PORT, { baudRate: BAUD_RATE })
    client.setTimeout(TIMEOUT_MS)

    connected = true
    setStatus("normal")
    console.log(`✅ Connected to Modbus successfully!`)
  } catch (err) {
    console.error("❌ Connect fail:", err.message)
    connected = false
    setStatus("no_port")

    // ลองใหม่ใน 2 วิ
    setTimeout(connectPort, 2000)
  } finally {
    isReconnecting = false
  }
}

// ERROR HANDLE (ใช้ใน readProbe)

export const handleModbusError = (err) => {
  console.error("🚨 Modbus Error:", err.message)

  // Error ที่ควร reconnect
  if (
    err.message.includes("Port Not Open") ||
    err.message.includes("ECONNRESET") ||
    err.message.includes("EBUSY") ||
    err.message.includes("Access denied") ||
    err.message.includes("IO error")
  ) {
    connected = false
    setStatus("no_port")
    connectPort() // เริ่ม reconnect
  }
}

// UTILITIES
export const getClient = () => client
export const isConnected = () => connected
export const getStatus = () => status
