import ModbusRTU from "modbus-serial"
import dotenv from "dotenv"

dotenv.config()

const SERIAL_PORT =
  process.platform === "win32"
    ? process.env.MODBUS_PORT
    : process.env.MODBUS_PORT_LINUX
const BAUD_RATE = Number(process.env.BAUD_RATE || 9600)
const TIMEOUT_MS = Number(process.env.MODBUS_TIMEOUT || 1000)

// client
const client = new ModbusRTU()
let connected = false
let isConnecting = false // ป้องกัน connect ซ้อน

// เชื่อมต่อ Modbus
export const connectPort = async () => {
  try {
    if (connected || isConnecting) return

    if (!SERIAL_PORT) {
      console.error("❌ SERIAL_PORT not defined in .env")
      return
    }

    isConnecting = true
    console.log(`Port : ${SERIAL_PORT}, BAUD_RATE : ${BAUD_RATE}`)
    await client.connectRTUBuffered(SERIAL_PORT, { baudRate: BAUD_RATE })
    client.setTimeout(TIMEOUT_MS)

    connected = true
    isConnecting = false
    console.log(`✅ Modbus connected: ${SERIAL_PORT} @${BAUD_RATE}`)
  } catch (err) {
    connected = false
    isConnecting = false
    console.error("❌ Modbus connect fail:", err.message)

    // ลองเชื่อมใหม่หลัง 2 วิ (Auto reconnect)
    setTimeout(connectPort, 2000)
  }
}

// ให้ไฟล์อื่นใช้ client ได้
export const getClient = () => {
  return client
}

// ให้ไฟล์อื่นเช็คว่ายัง connected อยู่หรือเปล่า
export const isConnected = () => {
  return connected
}
