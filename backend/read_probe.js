import ModbusRTU from "modbus-serial"
const client = new ModbusRTU() // ✅ ต้องใช้ new

const port = process.platform === "win32" ? "COM12" : "/dev/ttyUSB0"
const baudRate = 9600

const metersIdList = [3]

const cycleTime = 1000
const intervalPerMeter = cycleTime / metersIdList.length

let currentIndex = 0
let connected = false

// connect
const connectPort = async () => {
  try {
    console.log("🔌 Trying to connect...")
    await client.connectRTUBuffered(port, { baudRate })
    client.setTimeout(2000)
    connected = true
    console.log(`✅ Connected to ${port} @${baudRate}`)
  } catch (e) {
    connected = false
    console.log("❌ Connect fail, retry in 2s:", e.message)
    setTimeout(connectPort, 2000)
  }
}

// read float at address 0x0024
async function testRegisters(id) {
  if (!connected) {
    console.log("⚠️  Not connected")
    return
  }
  try {
    client.setID(id)
    const res = await client.readHoldingRegisters(0, 20)
    console.log("res:", res)
  } catch (e) {
    console.log(`🚨 Read fail (ID=${id}):`, e.message)
  }
}

const scheduleNext = async () => {
  const id = metersIdList[currentIndex]
  await testRegisters(id)

  currentIndex = (currentIndex + 1) % metersIdList.length
  setTimeout(scheduleNext, intervalPerMeter)
}

// Start
;(async () => {
  await connectPort()
  setTimeout(scheduleNext, 2000)
})()
