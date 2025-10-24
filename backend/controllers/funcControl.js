import prisma from "../db.js"

// Fuel Load
export const getFuelLoads = async (req, res) => {
  try {
    const fuelLoads = await prisma.fuel_load.findMany({
      include: {
        tank_setting: {
          select: {
            tank_name: true,
          },
        },
      },
      orderBy: {
        id: "desc", // เรียงข้อมูลจากมากไปน้อย ()
      },
    })
    const formatted = fuelLoads.map((item) => ({
      id: Number(item.id),
      tank_code: item.tank_code,
      tank_name: item.tank_setting.tank_name,
      v_order: Number(item.v_order),
      start_date: item.start_date,
      end_date: item.end_date,
      v_start: Number(item.v_start),
      v_end: Number(item.v_end),
      v_load: Number(item.v_load),
      description: item.description,
    }))
    res.status(200).json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Read FuelLoad Error", error: err.message })
  }
}

export const addFuelLoads = async (req, res) => {
  try {
    const {
      tank_code,
      v_order,
      start_date,
      end_date,
      v_start,
      v_end,
      v_load,
      description,
    } = req.body

    if (!tank_code) {
      return res.status(400).json({
        message: "Tank code is required",
      })
    }

    const newFuelLoad = await prisma.fuel_load.create({
      data: {
        tank_code,
        v_order: Number(v_order?.toFixed?.(2) || v_order || 0),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        v_start: Number(v_start?.toFixed?.(2) || v_start || 0),
        v_end: Number(v_end?.toFixed?.(2) || v_end || 0),
        v_load: Number(v_load?.toFixed?.(2) || v_load || 0),
        description,
      },
    })

    res
      .status(201)
      .json({ message: "FuelLoad created successfully", data: newFuelLoad })
  } catch (err) {
    console.error("Write FuelLoad Error :", err)
    res
      .status(500)
      .json({ message: "Write FuelLoad error", error: err.message })
  }
}
