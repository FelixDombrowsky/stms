export const formatTankData = (raw, info) => {
  if (raw.status === "no_probe") {
    console.log("raw:", raw.status)
    return {
      tank_code: info.tank_code,
      tank_name: info.tank_name,
      fuel_name: info.fuel_name,
      fuel_color: info.fuel_color,
      capacity_l: Number(info.capacity_l ?? 0),

      oil_height: 0,
      water_height: 0,
      oil_volume: 0,
      water_volume: 0,
      fuel_percent: 0,
      temp: 0,
      status: "no_probe",

      timestamp: raw.timestamp,
    }
  } else if (raw.status === "no_port") {
    // -88 No Comport ให้ reconnect
    // reConnectPort()
    console.log("raw:", raw.status)

    return {
      tank_code: info.tank_code,
      tank_name: info.tank_name,
      fuel_name: info.fuel_name,
      fuel_color: info.fuel_color,
      capacity_l: Number(info.capacity_l ?? 0),

      oil_height: 0,
      water_height: 0,
      oil_volume: 0,
      water_volume: 0,
      fuel_percent: 0,
      temp: 0,
      status: "no_port",

      timestamp: raw.timestamp,
    }
  } else if (raw.status === "error") {
    // error อื่นๆ
    return {
      tank_code: info.tank_code,
      tank_name: info.tank_name,
      fuel_name: info.fuel_name,
      fuel_color: info.fuel_color,
      capacity_l: Number(info.capacity_l ?? 0),

      oil_height: 0,
      water_height: 0,
      oil_volume: 0,
      water_volume: 0,
      fuel_percent: 0,
      temp: 0,
      status: "modbus_error",

      timestamp: raw.timestamp,
    }
  }
  // console.log("raw", raw.status)
  console.log(raw.oil_h)
  let oil_h = raw.oil_h

  console.log("probe_type:", info.probe_type_id)
  // ถ้าเป็น Hydrostatic ต้องคำนวณ q_oil ก่อน
  const oil_density = info.density && info.density > 0 ? info.density : 1
  if (info.probe_type_id === 1) {
    oil_h = Number((raw.oil_h * (1000 / oil_density) || 0).toFixed(0))
  }

  // Compensate
  oil_h = Number(oil_h ?? 0) + Number(info.comp_oil_mm ?? 0)
  let water_h = Number(raw.water_h ?? 0) + Number(info.comp_water_mm ?? 0)
  const temp = Number(raw.temp ? parseFloat(raw.temp).toFixed(1) : 0)
  // console.log("oil_h_com", oil_h)
  console.log("info.tank_type: ", info.tank_type)
  // คำนวณ Volume
  const a = Number(info.horizontal_mm || 0)
  const b = Number(info.vertical_mm || 0)
  const L = Number(info.length_mm || 0)
  const rx = a / 2
  const ry = b / 2
  let oil_volume
  let water_volume

  console.log("2222")

  if (info.tank_type === 1) {
    // Horizontal
    // Oil
    {
      const uRaw = oil_h / ry - 1
      const u = Math.max(-1, Math.min(1, uRaw))
      const sqrtTerm = Math.sqrt(Math.max(0, 1 - u * u))
      const A = rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
      oil_volume = (A * L) / 1_000_000
    }

    // Water
    {
      const uRaw = water_h / ry - 1
      const u = Math.max(-1, Math.min(1, uRaw))
      const sqrtTerm = Math.sqrt(Math.max(0, 1 - u * u))
      const A = rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
      water_volume = (A * L) / 1_000_000
    }
  } else if (info.tank_type === 2) {
    // Vertical
    let A = Math.PI * rx * ry
    oil_volume = (A * oil_h) / 1_000_000
    water_volume = (A * water_h) / 1_000_000
  } else {
    oil_volume = 0
    water_volume = 0
  }

  // กันค่าติดลบ
  oil_volume = Math.max(Number(parseFloat(oil_volume).toFixed(2)), 0)
  water_volume = Math.max(Number(parseFloat(water_volume).toFixed(2)), 0)
  console.log("oil_volume", oil_volume)
  console.log("water_volume", water_volume)

  const fuel_percent = info.capacity_l
    ? parseFloat((Number(oil_volume) / Number(info.capacity_l)).toFixed(2))
    : 0

  let status = "normal"
  if (info.high_alarm_l && oil_volume >= info.high_alarm_l) {
    status = "high_alarm"
  } else if (info.high_alert && oil_volume >= info.high_alert) {
    status = "high_alert"
  } else if (info.low_alarm_l && oil_volume <= info.low_alarm_l) {
    status = "low_alarm"
  } else if (
    info.water_high_alarm_l &&
    water_volume >= info.water_high_alarm_l
  ) {
    status = "water_alarm"
  }

  return {
    tank_code: info.tank_code,
    tank_name: info.tank_name,
    fuel_name: info.fuel_name,
    fuel_color: info.fuel_color,
    capacity_l: Number(info.capacity_l ?? 0),

    oil_height: Number(parseFloat(oil_h).toFixed(0)),
    water_height: Number(parseFloat(water_h).toFixed(0)),
    oil_volume: Number(parseFloat(oil_volume).toFixed(2)),
    water_volume: Number(parseFloat(water_volume).toFixed(2)),
    fuel_percent,
    temp: Number(parseFloat(temp).toFixed(1)),
    status,

    timestamp: raw.timestamp,
  }
}
