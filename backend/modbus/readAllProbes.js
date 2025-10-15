import { tankCache } from "../services/configCache.js"
import { readProbe } from "./readProbe.js"

// อ่านค่าจาก probe ทุกตัว
// @returns {Promise<Array>} array ของผลลัพธ์แต่ละ probe

export const readAllProbes = async () => {
  const results = []

  // ดึง probe_id ทั้งหมดจาก tankCache
  const probeIds = Array.from(tankCache.keys())

  if (probeIds.length === 0) {
    // ถ้าไม่มี probe -> คืน array ว่าง
    return results
  }

  // วนทีละตัว
  for (const id of probeIds) {
    const data = await readProbe(id)
    if (data) {
      results.push(data)
    }
  }

  return results
}
