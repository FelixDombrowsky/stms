export const formatTankData = (raw, info) => {
  // --- 1) จัดการ status ที่ไม่ใช่ normal ---
  if (raw.status === "no_probe") {
    return baseResult(info, 0, 0, 0, 0, 0, 0, 0, "no_probe", raw.timestamp)
  }
  if (raw.status === "no_port") {
    return baseResult(info, 0, 0, 0, 0, 0, 0, 0, "no_port", raw.timestamp)
  }
  if (raw.status === "error") {
    return baseResult(info, 0, 0, 0, 0, 0, 0, 0, "modbus_error", raw.timestamp)
  }

  // --- 2) เตรียมค่าเริ่มต้น ---
  let oil_h = Number(raw.oil_h ?? 0)
  let water_h = Number(raw.water_h ?? 0)
  const temp = raw.temp != null ? Number(parseFloat(raw.temp).toFixed(1)) : 0

  const tankType = Number(info.tank_type || 0)
  const density = info.density && info.density > 0 ? info.density : 1

  // --- 3) ประมวลผลตาม probe_type ---
  if (info.probe_type_id === 1) {
    // Hydrostatic
    oil_h = Number((oil_h * (1000 / density) || 0).toFixed(0))
  } else if (info.probe_type_id === 3) {
    // Ultrasonic
    if (tankType === 1) {
      oil_h = Number(info.vertical_mm || 0) - oil_h
    } else if (tankType === 2) {
      oil_h = Number(info.length_mm || 0) - oil_h
    } else {
      oil_h = oil_h
    }
  }

  // --- 4) Compensate ---
  oil_h += Number(info.comp_oil_mm ?? 0)
  water_h += Number(info.comp_water_mm ?? 0)

  // --- 5) เตรียมพารามิเตอร์ถัง ---
  const a = Number(info.horizontal_mm || 0)
  const b = Number(info.vertical_mm || 0)
  const L = Number(info.length_mm || 0)
  const rx = a / 2
  const ry = b / 2

  let oil_volume = 0
  let water_volume = 0

  // --- 6) คำนวณ Volume ---
  if (tankType === 1) {
    // Horizontal
    // Oil
    oil_volume = calcHorizontalVolume(oil_h, rx, ry, L)
    // Water
    water_volume = calcHorizontalVolume(water_h, rx, ry, L)
  } else if (tankType === 2) {
    // Vertical
    const A = Math.PI * rx * ry
    oil_volume = (A * oil_h) / 1_000_000
    water_volume = (A * water_h) / 1_000_000
  }

  // --- 7) กันค่าติดลบ
  oil_volume = Math.max(Number(oil_volume.toFixed(2)), 0)
  water_volume = Math.max(Number(water_volume.toFixed(2)), 0)

  // --- 8) Fuel percent (0–100)
  const capacity = Number(info.capacity_l || 0)
  const fuel_percent =
    capacity > 0 ? Number(((oil_volume / capacity) * 100).toFixed(2)) : 0
  const water_percent =
    capacity > 0 ? Number(((water_volume / capacity) * 100).toFixed(2)) : 0

  // --- 9) หา Status ---
  let status = "normal"
  if (info.high_alarm_l && oil_volume >= info.high_alarm_l)
    status = "high_alarm"
  else if (info.high_alert && oil_volume >= info.high_alert)
    status = "high_alert"
  else if (info.low_alarm_l && oil_volume <= info.low_alarm_l)
    status = "low_alarm"
  else if (info.water_high_alarm_l && water_volume >= info.water_high_alarm_l)
    status = "water_alarm"

  // --- 10) Return ---
  return {
    tank_code: info.tank_code,
    tank_name: info.tank_name,
    fuel_name: info.fuel_name,
    fuel_color: info.fuel_color,
    capacity_l: capacity,

    oil_height: Number(oil_h.toFixed(0)),
    water_height: Number(water_h.toFixed(0)),
    oil_volume: Number(oil_volume.toFixed(2)),
    water_volume: Number(water_volume.toFixed(2)),
    fuel_percent, // % เต็ม
    water_percent,
    temp,

    status,
    timestamp: raw.timestamp,
  }
}

// ✅ Helper: base result (ลด code ซ้ำ)
function baseResult(info, oh, wh, ov, wv, fp, wp, t, status, timestamp) {
  return {
    tank_code: info.tank_code,
    tank_name: info.tank_name,
    fuel_name: info.fuel_name,
    fuel_color: info.fuel_color,
    capacity_l: Number(info.capacity_l ?? 0),

    oil_height: oh,
    water_height: wh,
    oil_volume: ov,
    water_volume: wv,
    fuel_percent: fp,
    water_percent: wp,
    temp: t,

    status,
    timestamp,
  }
}

// ✅ Helper: คำนวณ Horizontal volume อย่างปลอดภัย
function calcHorizontalVolume(h, rx, ry, L) {
  if (ry <= 0 || rx <= 0 || L <= 0) return 0

  const uRaw = h / ry - 1
  const u = Math.max(-1, Math.min(1, uRaw))
  const sqrtTerm = Math.sqrt(Math.max(0, 1 - u * u))
  const A = rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
  return (A * L) / 1_000_000
}
