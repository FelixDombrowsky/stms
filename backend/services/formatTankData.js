export const formatTankData = (raw, info) => {
  // Validate อันไหนเป็น Null คือไม่ได้ set address ไว้ ให้ ส่งเป็น null ไป
  const oil_h = Number(raw.oil_h ?? 0) + Number(info.comp_oil_mm ?? 0)
  const water_h = Number(raw.water_h ?? 0) + Number(info.comp_water_mm ?? 0)
  const temp = Number(raw.temp ? parseFloat(raw.temp).toFixed(1) : 0)

  const oil_volume = Math.max(oil_h, 0)
  const water_volume = Math.max(water_h, 0)

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
  }

  return {
    tank_code: info.tank_code,
    tank_name: info.tank_name,
    fuel_name: info.fuel_name,
    fuel_color: info.fuel_color,
    capacity_l: Number(info.capacity_l ?? 0),

    oil_height: oil_h,
    water_height: water_h,
    oil_volume,
    water_volume,
    fuel_percent,
    temp,
    status,

    timestamp: raw.timestamp,
  }
}
