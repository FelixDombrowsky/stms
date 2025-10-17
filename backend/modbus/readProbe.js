import { isConnected, getClient, handleModbusError } from "./modbusClient.js"
import { readRegistersSafe } from "./readRegistersSafe.js"
import { parseValue } from "./parseValue.js"
import { tankCache } from "../services/configCache.js"

/** 
 * @param {number} probe_id
 * @returns {object} { probe_id, oil_h, water_h, temp, status, timestamp }
 */
export const readProbe = async (probe_id) => {
  const timestamp = new Date().toISOString()

  // 1) ถ้า Modbus ไม่เชื่อมต่อ
  if (!isConnected()) {
    return {
      probe_id,
      oil_h: null,
      water_h: null,
      temp: null,
      status: "no_port",
      timestamp,
    }
  }

  // 2) ดึง config จาก cache
  const config = tankCache.get(probe_id)
  if (!config) {
    return {
      probe_id,
      oil_h: null,
      water_h: null,
      temp: null,
      status: "no_config",
      timestamp,
    }
  }

  try {
    const {
      function_code,
      address_length,
      oil_h_address,
      oil_h_scale,
      water_h_address,
      water_h_scale,
      temp_address,
      temp_scale,
      format,
    } = config

    const client = getClient()
    client.setID(Number(probe_id))

    // รวม address ทั้งหมดที่ใช้งาน (อาจมี null)
    const addresses = [oil_h_address, water_h_address, temp_address].filter(
      (addr) => addr !== null && addr !== undefined && addr >= 0
    )

    // ถ้าไม่มี address ใดเลย → no_address
    if (addresses.length === 0) {
      return {
        probe_id,
        oil_h: null,
        water_h: null,
        temp: null,
        status: "no_address",
        timestamp,
      }
    }

    // ✅ หา start = address ที่น้อยที่สุด
    const startAddr = Math.min(...addresses)

    // ✅ หา end = address สูงสุด + address_length
    //    เช่น temp_address = 104, address_length = 2 → ต้องอ่านถึง 106
    const maxAddr = Math.max(...addresses)
    const readLength = maxAddr + (address_length || 1) - startAddr

    // เพื่อความปลอดภัย
    if (readLength <= 0) {
      return {
        probe_id,
        oil_h: null,
        water_h: null,
        temp: null,
        status: "no_address",
        timestamp,
      }
    }

    // ✅ อ่าน register เฉพาะช่วงที่ต้องใช้
    const raw = await readRegistersSafe(
      function_code,
      startAddr,
      readLength,
      20 // chunk size
    )

    // Helper: แปลง address จริง → index ใน raw
    const getOffsetValue = (addr, scale, type) => {
      if (addr === null || addr === undefined || addr < 0) return null
      const offset = addr - startAddr
      return parseValue(raw, offset, address_length, scale, format, type)
    }

    // ✅ ดึงค่าแต่ละตัว (ถ้า address = null → ได้ null ตามเงื่อนไขของคุณ)
    const oil_h = getOffsetValue(oil_h_address, oil_h_scale)
    const water_h = getOffsetValue(water_h_address, water_h_scale)
    const temp = getOffsetValue(temp_address, temp_scale)

    // ✅ Status normal เสมอ (แม้บางตัวจะไม่มี address) เพราะคุณเลือก "ข้าม"
    return {
      probe_id,
      oil_h,
      water_h,
      temp,
      status: "normal",
      timestamp,
    }
  } catch (err) {
    console.error(`❌ readProbe(${probe_id}) error:`, err.message)

    // ✅ Timeout = เจอ Probe ไม่ได้
    if (err.message.includes("Timed out")) {
      return {
        probe_id,
        oil_h: null,
        water_h: null,
        temp: null,
        status: "no_probe",
        timestamp,
      }
    }

    // ✅ Port หลุด ตอนอ่าน
    if (
      err.message.includes("Port Not Open") ||
      err.message.includes("Error: write E")
    ) {
      handleModbusError(err)
      return {
        probe_id,
        oil_h: null,
        water_h: null,
        temp: null,
        status: "no_port",
        timestamp,
      }
    }

    // ✅ Error อื่น ๆ
    return {
      probe_id,
      oil_h: null,
      water_h: null,
      temp: null,
      status: "error",
      timestamp,
    }
  }
}
