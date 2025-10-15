// รับ probe_id →
// ดึง config address/scale/format/function_code จาก tankCache
//  ตั้ง client.setID(probe_id)
//  คำนวณว่าจะอ่านกี่ register (max address + address_length)
//  ใช้ readRegistersSafe(...) อ่าน raw registers
//  ใช้ parseValue(...) แปลง oil, water, temp

import { isConnected, getClient } from "./modbusClient.js"
import { readRegistersSafe } from "./readRegistersSafe.js"
import { parseValue } from "./parseValue.js"
import { tankCache } from "../services/configCache.js"

/**
 * อ่านค่าจาก 1 probe_id
 * @param {number} probe_id
 * @returns {object|null} { probe_id, oil_h, water_h, temp, timestamp }
 */

export const readProbe = async (probe_id) => {
  // 1) ตรวจว่า Modbus ต่ออยู่ไหม
  if (!isConnected()) {
    console.warn(`⚠ readProbe: Modbus not connected`)
    return null
  }

  // 2) ดึง config จาก tankCache
  const config = tankCache.get(probe_id)
  if (!config) {
    console.warn(`⚠ readProbe: No config for probe_id=${probe_id}`)
    return null
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

    // 3) ตั้ง slave ID
    const client = getClient()
    client.setID(probe_id)

    // 4) คำนวณว่าต้องอ่าน ถึง address ไหน
    //    สมมติ address สูงสุด = temp_address = 10 และ address_length = 2
    //    => ต้องอ่านถึง 10+2=12 register (0,1,...,11)
    const maxAddr = Math.max(
      oil_h_address ?? -1,
      water_h_address ?? -1,
      temp_address ?? -1
    )
    const totalLen = (maxAddr >= 0 ? maxAddr : 0) + (address_length || 1)

    if (totalLen <= 0) {
      // ไม่มีค่าอะไรให้อ่าน
      return {
        probe_id,
        oil_h: null,
        water_h: null,
        temp: null,
        timestamp: new Date().toISOString(),
      }
    }

    // 5) อ่าน register แบบ chunk ปลอดภัย
    const raw = await readRegistersSafe(function_code, 0, totalLen, 20)
    // จะได้ raw = [val0, val1, val2, ...]

    // 6) แปลงค่าแต่ละตัว
    const oil_h = parseValue(
      raw,
      oil_h_address,
      address_length,
      oil_h_scale,
      format
    )
    const water_h = parseValue(
      raw,
      water_h_address,
      address_length,
      water_h_scale,
      format
    )
    const temp = parseValue(
      raw,
      temp_address,
      address_length,
      temp_scale,
      format
    )

    // 7) คือค่ารูปแบบที่ websocket จะใช้
    return {
      probe_id,
      oil_h,
      water_h,
      temp,
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    console.error(`❌ Error reading probe ${probe_id}:`, err.message)
    return null
  }
}
