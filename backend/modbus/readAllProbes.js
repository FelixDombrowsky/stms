// readAllProbes.js
import { tankCache } from "../services/configCache.js"
import { readProbe } from "./readProbe.js"

/**
 * อ่านค่าจาก probe ทุกตัวในระบบ
 * @returns {Promise<Array>} [{ probe_id, oil_h, water_h, temp, status, timestamp }, ...]
 */
export const readAllProbes = async () => {
  const results = []

  // 1) ดึง probe_id ทั้งหมดจาก tankCache
  const probeIds = Array.from(tankCache.keys())

  if (probeIds.length === 0) {
    // ไม่มี probe เลย
    return results
  }

  // 2) อ่านทีละตัว (await เพื่อแยกอาการผิดพลาดแต่ละตัว)
  for (const id of probeIds) {
    try {
      const data = await readProbe(id)
      await new Promise((r) => setTimeout(r, 50)) // พัก 50 ms
      // console.log("wait 50 ms")
      results.push(data)
    } catch (err) {
      //กันเหนียว เผื่อเกิด exception แบบที่ไม่ได้จับใน readProbe()
      console.error(`❌ Unexpected error at probe ${id}:`, err.message)
      results.push({
        probe_id: id,
        oil_h: null,
        water_h: null,
        temp: null,
        status: "error",
        timestamp: new Date().toISOString(),
      })
    }
  }

  return results
}
