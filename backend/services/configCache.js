import prisma from "../db.js"

export const tankCache = new Map()

export async function loadTankCache() {
  const tanks = await prisma.tank_setting.findMany({
    include: {
      fuel_name: {
        include: {
          fuel_type: true,
        },
      },
      probe_setting: true,
    },
  })

  tankCache.clear()

  tanks.forEach((item) => {
    tankCache.set(item.probe_id, {
      tank_code: item.code,
      tank_name: item.tank_name,

      // Tank
      capacity_l: Number(item.capacity_l ?? 0),
      tank_type: item.tank_type ?? 1,
      vertical_mm: Number(item.vertical_mm ?? 0),
      horizontal_mm: Number(item.horizontal_mm ?? 0),
      length_mm: Number(item.length_mm ?? 0),
      comp_oil_mm: Number(item.comp_oil_mm ?? 0),
      comp_water_mm: Number(item.comp_water_mm ?? 0),
      high_alarm_l: Number(item.high_alarm_l ?? 0),
      high_alert_l: Number(item.high_alert_l ?? 0),
      low_alarm_l: Number(item.low_alarm_l ?? 0),
      water_high_alarm_l: Number(item.water_high_alarm_l ?? 0),

      // Fuel
      fuel_name: item.fuel_name?.fuel_name ?? null,
      fuel_color: item.fuel_name?.fuel_color ?? null,
      density: Number(item.fuel_name?.density ?? 0),

      // Probe
      probe_type_id: item.probe_setting?.probe_type_id ?? null,
      oil_h_address: item.probe_setting?.oil_h_address ?? -1,
      oil_h_scale: item.probe_setting?.oil_h_scale ?? 1,
      water_h_address: item.probe_setting?.water_h_address ?? -1,
      water_h_scale: item.probe_setting?.water_h_scale ?? 1,
      temp_address: item.probe_setting?.temp_address ?? -1,
      temp_scale: item.probe_setting?.temp_scale ?? 1,
      format: item.probe_setting?.format ?? "AB CD",
      function_code: item.probe_setting?.function_code ?? "03",
      address_length: item.probe_setting?.address_length ?? 2,
    })
  })
  tanks.forEach((t, i) => {
    console.log(`${i}: tank_code=${t.code}, probe_id=${t.probe_id}`)
  })
  //   console.log("TankCache Entries:", Array.from(tankCache.entries()))
}

// ✅ ฟังก์ชันที่ให้ route อื่นเรียกเพื่อล้าง cache แล้วโหลดใหม่
export async function refreshTankCache() {
  await loadTankCache()
  console.log("🔄 Tank cache refreshed!")
}
