// รับ:
// raw = ค่า register ที่อ่านมาทั้งหมด (array เช่น [1234, 5678, 9876, 4321])
// address = ตำแหน่งเริ่มต้น เช่น 10
// length = 1 word หรือ 2 word
// scale = ตัวคูณ เช่น 0.1 หรือ 1
// format = “AB CD”, “CD AB”, “BA DC”, “DC BA”
// ทำ:
// ถ้า address < 0 → ไม่ใช้ → return null
// ถ้า length == 2 → ต้อง reorder byte + อ่าน float32
// ถ้า length == 1 → อ่าน integer + scale
// return number พร้อม scale

const reorder = (words, format) => {
  // words = [w0, w1]
  // w0    = high 16 bits
  // w1    = low  16 bits

  const w0 = words[0] || 0
  const w1 = words[1] || 0

  // แยก byte เป็น hi/lo
  const w0_hi = (w0 >> 8) & 0xff // 0xff = 11111111
  const w0_lo = w0 & 0xff
  const w1_hi = (w1 >> 8) & 0xff
  const w1_lo = w1 & 0xff

  switch (format) {
    case "AB CD":
      return Buffer.from([w0_hi, w0_lo, w1_hi, w1_lo])
    case "CD AB":
      return Buffer.from([w1_hi, w1_lo, w0_hi, w0_lo])
    case "BA DC":
      return Buffer.from([w0_lo, w0_hi, w1_lo, w1_hi])
    case "DC BA":
      return Buffer.from([w1_lo, w1_hi, w0_lo, w0_hi])
  }
}

export const parseValue = (raw, address, length, scale, format) => {
  // ถ้า address เป็น null หรือ -1 -> หมายถึงไม่ได้ตั้งค่า
  if (address == null || address < 0) {
    return null
  }

  const s = Number(scale) || 1

  // length 2 = float
  if (length === 2) {
    const pair = raw.slice(address, address + 2)
    if (pair.length < 2) return null // กัน error

    const buf = reorder(pair, format)
    // sensor ทั่วไปใช้ big-edian => readFloatBE
    const val = buf.readFloatBE(0)
    return val * s
  }
  // length === 1 -> integer 16-bit
  else {
    const v = raw[address]
    if (v == null) return null
    return v * s
  }
}
