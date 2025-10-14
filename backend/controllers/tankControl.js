// Databases
// import pool from "../db.js";
import prisma from "../db.js"
import { levenbergMarquardt } from "ml-levenberg-marquardt"

// Tank Setting
export const getTankSettings = async (req, res) => {
  try {
    const tankSettings = await prisma.tank_setting.findMany({
      include: {
        fuel_name: {
          select: {
            fuel_name: true,
          },
        },
      },
      orderBy: {
        code: "asc",
      },
    })
    // const result = await pool.query(`
    //      SELECT p.*, s.fuel_name
    //      FROM tank_setting p
    //      JOIN fuel_names s ON p.fuel_code = s.fuel_code
    //      ORDER BY p.code ASC
    //   `)
    res.status(200).send(tankSettings)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Read Tank setting Error", error: err.message })
  }
}

export const addTankSettings = async (req, res) => {
  try {
    const {
      code,
      name,
      probe_id,
      fuel_code,
      capacity,
      tank_type,
      vertical,
      horizontal,
      tank_length,
      cal_capacity,
      comp_oil,
      comp_water,
      high_alarm,
      high_alert,
      low_alarm,
      water_alarm,
    } = req.body

    if (!code || !name || !probe_id || !fuel_code) {
      return res.status(400).json({
        message: "code, name, probe_id and fuel_code are required",
      })
    }

    const newTank = await prisma.tank_setting.create({
      data: {
        code,
        tank_name: name,
        probe_id: Number(probe_id),
        fuel_code,
        capacity_l: Number(capacity),
        tank_type: Number(tank_type),
        vertical_mm: Number(vertical),
        horizontal_mm: Number(horizontal),
        length_mm: Number(tank_length),
        cal_capacity_l: Number(cal_capacity),
        comp_oil_mm: Number(comp_oil),
        comp_water_mm: Number(comp_water),
        high_alarm_l: Number(high_alarm),
        high_alert_l: Number(high_alert),
        low_alarm_l: Number(low_alarm),
        water_high_alarm_l: Number(water_alarm),
      },
    })

    // const { rows } = await pool.query(
    //   `INSERT INTO tank_setting (code,tank_name,probe_id,fuel_code,capacity_l,tank_type,vertical_mm,horizontal_mm,length_mm,cal_capacity_l,comp_oil_mm,comp_water_mm,high_alarm_l,high_alert_l,low_alarm_l,water_high_alarm_l)
    //       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    //       RETURNING *`,
    //   [
    //     code,
    //     name,
    //     probe_id,
    //     fuel_code,
    //     Number(capacity),
    //     Number(tank_type),
    //     Number(vertical),
    //     Number(horizontal),
    //     Number(tank_length),
    //     Number(cal_capacity),
    //     Number(comp_oil),
    //     Number(comp_water),
    //     Number(high_alarm),
    //     Number(high_alert),
    //     Number(low_alarm),
    //     Number(water_alarm),
    //   ]
    // );

    res
      .status(201)
      .json({ message: "Tank created successfully", data: newTank })
  } catch (err) {
    if (err.code === "p2002") {
      return res.status(400).json({
        message: `Duplicate entry: ${err.meta.target}`,
      })
    }
    console.error(err)
    res
      .status(500)
      .json({ message: "Write Tank setting error", error: err.message })
  }
}

export const updateTankSettings = async (req, res) => {
  const { code } = req.params
  try {
    const {
      name,
      probe_id,
      fuel_code,
      capacity,
      tank_type,
      vertical,
      horizontal,
      tank_length,
      cal_capacity,
      comp_oil,
      comp_water,
      high_alarm,
      high_alert,
      low_alarm,
      water_alarm,
    } = req.body

    if (!code || code.trim() === "") {
      return res.status(400).json({ message: "Invalid tank code." })
    }

    const updated = await prisma.tank_setting.update({
      data: {
        tank_name: name,
        probe_id: Number(probe_id),
        fuel_code,
        capacity_l: capacity ? Number(capacity) : null,
        tank_type: tank_type ? Number(tank_type) : null,
        vertical_mm: vertical ? Number(vertical) : null,
        horizontal_mm: horizontal ? Number(horizontal) : null,
        length_mm: tank_length ? Number(tank_length) : null,
        cal_capacity_l: cal_capacity ? Number(cal_capacity) : null,
        comp_oil_mm: comp_oil ? Number(comp_oil) : null,
        comp_water_mm: comp_water ? Number(comp_water) : null,
        high_alarm_l: high_alarm ? Number(high_alarm) : null,
        high_alert_l: high_alert ? Number(high_alert) : null,
        low_alarm_l: low_alarm ? Number(low_alarm) : null,
        water_high_alarm_l: water_alarm ? Number(water_alarm) : null,
      },
      where: {
        code: code,
      },
    })

    // const result = await pool.query(
    //   `UPDATE tank_setting
    //   SET tank_name = $2,
    //       probe_id = $3,
    //       fuel_code = $4,
    //       capacity_l = $5,
    //       tank_type = $6,
    //       vertical_mm = $7,
    //       horizontal_mm = $8,
    //       length_mm = $9,
    //       cal_capacity_l = $10,
    //       comp_oil_mm = $11,
    //       comp_water_mm = $12,
    //       high_alarm_l = $13,
    //       high_alert_l = $14,
    //       low_alarm_l = $15,
    //       water_high_alarm_l = $16
    //       WHERE code = $1
    //       RETURNING *`,
    //   [
    //     code.trim(),
    //     name,
    //     probe_id,
    //     fuel_code,
    //     Number(capacity),
    //     Number(tank_type),
    //     Number(vertical),
    //     Number(horizontal),
    //     Number(tank_length),
    //     Number(cal_capacity),
    //     Number(comp_oil),
    //     Number(comp_water),
    //     Number(high_alarm),
    //     Number(high_alert),
    //     Number(low_alarm),
    //     Number(water_alarm),
    //   ]
    // );

    //success
    return res
      .status(200)
      .json({ message: "Tank update successfully", data: updated })
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: `Tank with code ${code} not found.`,
      })
    }
    console.error("Update Tank Error:", err)
    res.status(500).json({ message: "Update Tank error", error: err.message })
  }
}

export const deleteTankSettings = async (req, res) => {
  try {
    const { code } = req.params

    if (!code || code.trim() === "") {
      return res.status(400).json({ message: "Invalid Tank Code" })
    }

    const deleted = await prisma.tank_setting.delete({
      where: { code: code.trim() },
    })
    // const result = await pool.query(
    //   `
    //   DELETE FROM tank_setting
    //   WHERE code = $1
    //   RETURNING *
    // `,
    //   [code.trim()]
    // );

    return res.status(200).json({
      message: `Tank with code ${code} deleted successfully.`,
      data: deleted,
    })
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: `Tank with code ${code} not found.`,
      })
    }
    console.error("Delete Tank Error:", err)
    res.status(500).json({ message: "Delete Tank error", error: err.message })
  }
}

// Tank Guide Chart
export const getTankCalculation = async (req, res) => {
  try {
    const tanks = await prisma.tank_setting.findMany({
      select: {
        code: true,
        tank_type: true,
        vertical_mm: true,
        horizontal_mm: true,
        length_mm: true,
      },
    })

    // ไม่มี tank
    if (tanks.length === 0) {
      return res.status(200).json({
        message: "No tanks found",
        data: [],
      })
    }
    // รูปแบบ payload
    // [
    //  {
    //    tank_code: item.code,
    //    data:[{},{},...,{}]
    //  },
    //  {
    //    tank_code: item.code,
    //    data:[{},{},...,{}]
    //  },
    //
    // ]

    const tank_cal_payload = []
    tanks.forEach((item) => {
      const a = item.horizontal_mm
      const b = item.vertical_mm
      const L = item.length_mm
      const type = item.tank_type
      const code = item.code

      const rx = a / 2
      const ry = b / 2
      const cal_data = []

      // Horizontal
      if (type === 1) {
        for (let h = 0; h <= b; h++) {
          const uRaw = h / ry - 1
          const u = Math.max(-1, Math.min(1, uRaw))
          const sqrtTerm = Math.sqrt(Math.max(0, 1 - u * u))
          const A = rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
          const volL = (A * L) / 1_000_000
          cal_data.push({ height: h, volume: volL.toFixed(2) })
        }
      } else {
        // Vertical
        for (let h = 0; h <= L; h++) {
          const A = Math.PI * rx * ry
          const volL = (A * h) / 1_000_000
          cal_data.push({ height: h, volume: volL.toFixed(2) })
        }
      }

      tank_cal_payload.push({ tank_code: code, data: cal_data })
    })

    res
      .status(200)
      .json({ message: "tank calculate success!", data: tank_cal_payload })
  } catch (err) {
    console.error("Tank Calculate Error!", err)
    res
      .status(500)
      .json({ message: "Tank Calculate Error!", error: err.message })
  }
}

export const trainTankGuide = async (req, res) => {
  try {
    const {
      real_data,
      tank_code,
      // horizontal,
      // vertical,
      // tank_length,
      // tank_type,
    } = req.body

    const tank = await prisma.tank_setting.findFirst({
      where: { code: tank_code },
      select: {
        tank_type: true,
        vertical_mm: true,
        horizontal_mm: true,
        length_mm: true,
      },
    })

    if (!tank) {
      return res.status(404).json({ message: "Tank not found" })
    }

    const {
      tank_type,
      vertical_mm: vertical,
      horizontal_mm: horizontal,
      length_mm: tank_length,
    } = tank

    // console.log("Tank Parameter = ", tank_parameter)

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!real_data || real_data.length === 0) {
      return res.status(400).json({ error: "Missing real_data" })
    }

    // ✅ ค่าพารามิเตอร์เริ่มต้น
    const a_old = Number(horizontal)
    const b_old = Number(vertical)
    const L_old = Number(tank_length)

    // ✅ เตรียมข้อมูลสำหรับ model
    const data = {
      x: real_data.map((p) => Number(p.height)),
      y: real_data.map((p) => Number(p.volume)),
    }

    // ✅ ฟังก์ชันคำนวณพื้นที่วงรีแนวนอน

    // Horizontal Tank
    const A = (a, b, h) => {
      const ry = b / 2
      const rx = a / 2
      const hh = Math.max(0, Math.min(h, b))

      const u = hh / ry - 1
      if (u < -1) return 0
      if (u > 1) return Math.PI * rx * ry
      const sqrtTerm = Math.sqrt(1 - u * u)
      return rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)
    }

    // ✅ ฟังก์ชัน fitting สำหรับ Levenberg-Marquardt

    const fittingFunction = (params) => {
      const [a, b, L] = params

      if (tank_type == 1) {
        return (h) => (L * A(a, b, h)) / 1_000_000 // mm³ → L
      } else {
        return (h) => (Math.PI * (a / 2) * (b / 2) * h) / 1_000_000
      }
    }

    // ✅ กำหนดค่าพารามิเตอร์เริ่มต้นและ options
    const initialParams = [a_old, b_old, L_old]
    const options = {
      initialValues: initialParams,
      damping: 0.01,
      maxIterations: 500,
      gradientDifference: 1e-3,
      errorTolerance: 1e-8,
    }

    // ✅ เริ่ม train model
    console.log(`🚀 Training model for Tank ${tank_code}...`)
    const result = levenbergMarquardt(data, fittingFunction, options)

    const [a_new, b_new, L_new] = result.parameterValues

    // ✅ คำนวณค่า Volume ที่ได้จาก model เดิมและ model ใหม่
    const predict = fittingFunction(result.parameterValues)
    const vNew = data.x.map((h) => predict(h))
    const vOld = data.x.map((h) => fittingFunction(initialParams)(h))

    // ✅ คำนวณค่า R²
    const yMean = data.y.reduce((sum, val) => sum + val, 0) / data.y.length
    const ssTot = data.y.reduce((sum, val) => sum + (val - yMean) ** 2, 0)
    const ssRes = data.y.reduce((sum, val, i) => sum + (val - vNew[i]) ** 2, 0)
    const R2 = 1 - ssRes / ssTot

    console.log("tank Code :", tank_code)
    console.log("a_old :", a_old)
    console.log("b_old :", b_old)
    console.log("L_old :", L_old)
    console.log("a_new :", a_new)
    console.log("b_new :", b_new)
    console.log("L_new :", L_new)
    console.log("R2 :", R2)
    console.log("parameterError :", result.parameterError)
    console.log("iterations :", result.iterations)
    console.log("h :", data.x)
    console.log("vTrue :", data.y)
    console.log("vOld :", vOld)
    console.log("vNew :", vNew)
    console.log("Training Model Finished !!!")
    // ✅ ตอบกลับไปยัง Frontend
    return res.json({
      tank_code,
      a_old,
      b_old,
      L_old,
      a_new,
      b_new,
      L_new,
      R2,
      parameterError: result.parameterError,
      iterations: result.iterations,
      h: data.x,
      vTrue: data.y,
      vOld,
      vNew,
    })
  } catch (err) {
    console.error("❌ Train error:", err)
    res.status(500).json({ error: "Training failed", details: err.message })
  }
}

export const updateAutoStatus = async (req, res) => {
  try {
    const { code } = req.params
    const { auto_status } = req.body

    if (!code || auto_status === undefined) {
      return res
        .status(400)
        .json({ error: "tank_code and auto_status are required" })
    }
    const updated = await prisma.tank_setting.update({
      where: { code: code },
      data: { auto_status: Number(auto_status) },
    })
    res.status(200).json({ message: "Auto status updated", data: updated })
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ error: "No Code Found", details: err.message })
    }
    console.error("❌ Set Auto Error :", err)
    res.status(500).json({ error: "Set Auto Error", details: err.message })
  }
}
