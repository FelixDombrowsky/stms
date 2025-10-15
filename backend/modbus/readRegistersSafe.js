// Modbus ส่วนใหญ่ไม่อนุญาตให้เราขออ่าน register จำนวนเยอะๆ ในครั้งเดียว เช่น บางเซนเซอร์อ่านได้สูงสุด 20 register / ครั้ง
// อ่านค่า registers จำนวนมากแบบ “ปลอดภัย” โดยแบ่ง block ไม่เกิน 20 register ต่อครั้ง (ป้องกัน sensor หรือ converter ล่ม)

import { isConnected, getClient } from "./modbusClient.js"

export const readRegistersSafe = async (
  funcCode,
  start,
  length,
  maxLen = 20
) => {
  if (!isConnected) {
    throw new Error("Modbus not connected")
  }
  // funcCode = "03","04"
  // start    = register เริ่มต้น (เช่น 0)
  // length   = อ่านทั้งหมดกี่ register
  // maxLen   = ความยาวสูงสุดต่อครั้ง (default = 20)
  // @returns {Promise<number[]>} array ของค่าทุก register (raw data)

  const client = getClient()
  let result = []
  let offset = start

  while (offset < start + length) {
    const chunkSize = Math.min(maxLen, start + length - offset)
    let res

    if (funcCode === "03") {
      res = await client.readHoldingRegisters(offset, chunkSize)
    } else if (funcCode === "04") {
      res = await client.readInputRegisters(offset, chunkSize)
    } else {
      throw new Error(`Unsupported function code : ${funcCode}`)
    }

    result = result.concat(res.data)
    offset += chunkSize
  }

  return result // array of numbers
}
