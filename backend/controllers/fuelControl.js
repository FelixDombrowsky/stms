// Databases
import prisma from "../db.js"
import { refreshTankCache } from "../services/configCache.js"

// Fuel Types
export const getFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await prisma.fuel_type.findMany({
      orderBy: {
        fuel_type_code: "asc",
      },
    })
    res.status(200).json(fuelTypes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Read FuelType Error", error: err.message })
  }
}

export const addFuelTypes = async (req, res) => {
  try {
    const { fuel_type_code, fuel_type_name, density } = req.body

    if (!fuel_type_code || !fuel_type_name) {
      return res
        .status(400)
        .json({ message: "fuel_type_code and fuel_type are required" })
    }

    const newFuelType = await prisma.fuel_type.create({
      data: {
        fuel_type_code,
        fuel_type_name,
        density,
      },
    })

    await refreshTankCache()

    res.status(201).json({
      message: "Fuel Type created successfully",
      data: newFuelType,
    })
  } catch (err) {
    // Handle PK ซ้ำ
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "fuel_type_code already exists",
      })
    }
    console.error(err)
    res.status(500).json({ message: "Post FuelType Error", error: err.message })
  }
}

export const deleteFuelTypes = async (req, res) => {
  const { code } = req.params
  try {
    const deleted = await prisma.fuel_type.delete({
      where: {
        fuel_type_code: code,
      },
    })

    await refreshTankCache()
    // await loadProbeConfigsFromDB()
    res.status(200).json({
      message: "Fuel type deleted successfully",
      data: deleted,
    })
  } catch (err) {
    if (err.code === "P2003") {
      // Foreign key constraint failed
      return res.status(400).json({
        message: "Cannot delete: fuel_type is used by fuel_name.",
      })
    }
    if (err.code === "p2025") {
      return res.status(404).json({ message: "Fuel type not found" })
    }
    console.error(err)
    res
      .status(500)
      .json({ message: "Delete FuelType Error", error: err.message })
  }
}

export const updateFuelTypes = async (req, res) => {
  const { code } = req.params
  try {
    const { fuel_type_name, density } = req.body

    if (!fuel_type_name) {
      return res.status(400).json({ message: "fuel type name is required" })
    }

    const updated = await prisma.fuel_type.update({
      data: {
        fuel_type_name,
        density,
      },
      where: {
        fuel_type_code: code,
      },
    })
    await refreshTankCache()
    res.status(200).json({
      message: "Fuel Type updated successfully",
      data: updated,
    })
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Fuel type code not found" })
    }
    console.error(err)
    res
      .status(500)
      .json({ message: "Update FuelType Error", error: err.message })
  }
}

// Fuel Names
export const getFuelNames = async (req, res) => {
  try {
    const fuelNames = await prisma.fuel_name.findMany({
      include: {
        fuel_type: {
          select: {
            fuel_type_name: true,
          },
        },
      },
      orderBy: {
        fuel_code: "asc",
      },
    })
    res.status(200).json(fuelNames)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Read FuelName Error", error: err.message })
  }
}

export const addFuelNames = async (req, res) => {
  try {
    const { fuel_code, fuel_name, description, fuel_type_code, fuel_color } =
      req.body

    if (!fuel_code || !fuel_name || !fuel_type_code) {
      return res
        .status(400)
        .json({ message: "fuel_code, fule_name, fuel_type_code are required" })
    }

    const newFuelName = await prisma.fuel_name.create({
      data: {
        fuel_code,
        fuel_name,
        description: description || null,
        fuel_type_code,
        fuel_color,
      },
    })
    await refreshTankCache()
    res
      .status(201)
      .json({ message: "Fuel Name created successfully", data: newFuelName })
  } catch (err) {
    // เช็ค duplicate fuel_code
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "fuel_code already exists",
      })
    }
    console.error(err)
    res
      .status(500)
      .json({ message: "Write Fuel Name Error", error: err.message })
  }
}

export const updateFuelNames = async (req, res) => {
  const { code } = req.params
  try {
    const { fuel_name, description, fuel_type_code, fuel_color } = req.body
    if (!fuel_name || !fuel_type_code) {
      return res
        .status(400)
        .json({ message: "fuel_name, fuel_type_code are required" })
    }

    const updated = await prisma.fuel_name.update({
      data: {
        fuel_name,
        fuel_type_code,
        fuel_color,
        description,
      },
      where: {
        fuel_code: code,
      },
    })

    // const { rows } = await pool.query(
    //   `  UPDATE fuel_names
    //      SET fuel_name = $2,
    //      description = $3,
    //          fuel_type = $4,
    //          fuel_color = $5

    //      WHERE fuel_code = $1
    //      RETURNING *`,
    //   [code, fuel_name, description, fuel_type, fuel_color]
    // );

    await refreshTankCache()

    res
      .status(200)
      .json({ message: "Fuel Name updated successfully", data: updated })
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Fuel code not found", error: err.message })
    }
    console.error(err)
    res.status(500).json({ message: "Update Name Error", error: err.message })
  }
}

export const deleteFuelNames = async (req, res) => {
  const { code } = req.params
  try {
    const deleted = await prisma.fuel_name.delete({
      where: {
        fuel_code: code,
      },
    })
    // const { rows } = await pool.query(
    //   `DELETE FROM fuel_names
    //      WHERE fuel_code = $1
    //      RETURNING *`,
    //   [code]
    // );
    await refreshTankCache()
    res.json({
      message: "Fuel Name deleted successfully",
      data: deleted,
    })
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Fuel code not found" })
    }
    console.error(err)
    res
      .status(500)
      .json({ message: "Delete Fuel Name Error", error: err.message })
  }
}
