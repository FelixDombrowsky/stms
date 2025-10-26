import prisma from "../db.js";

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
    });
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
    }));
    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Read FuelLoad Error", error: err.message });
  }
};

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
      v1_auto,
      h1_auto,
      v2_auto,
      h2_auto,
    } = req.body;

    if (!tank_code) {
      return res.status(400).json({
        message: "Tank code is required",
      });
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
        v1_auto: Number(v1_auto?.toFixed?.(2) || v1_auto || 0),
        h1_auto: Number(h1_auto?.toFixed?.(2) || h1_auto || 0),
        v2_auto: Number(v2_auto?.toFixed?.(2) || v2_auto || 0),
        h2_auto: Number(h2_auto?.toFixed?.(2) || h2_auto || 0),
      },
    });

    res
      .status(201)
      .json({ message: "FuelLoad created successfully", data: newFuelLoad });
  } catch (err) {
    console.error("Write FuelLoad Error :", err);
    res
      .status(500)
      .json({ message: "Write FuelLoad error", error: err.message });
  }
};

export const updateFuelLoad = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tank_code,
      v_order,
      start_date,
      end_date,
      v_start,
      v_end,
      v_load,
      description,
      v1_auto,
      h1_auto,
      v2_auto,
      h2_auto,
    } = req.body;

    if (!id || !tank_code) {
      return res.status(400).json({
        message: "Id or TankCode are required",
      });
    }

    const updated = await prisma.fuel_load.update({
      data: {
        tank_code,
        v_order: Number(v_order?.toFixed?.(2) || v_order || 0),
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        v_start: Number(v_start?.toFixed?.(2) || v_start || 0),
        v_end: Number(v_end?.toFixed?.(2) || v_end || 0),
        v_load: Number(v_load?.toFixed?.(2) || v_load || 0),
        description,
        v1_auto: Number(v1_auto?.toFixed?.(2) || v1_auto || 0),
        h1_auto: Number(h1_auto?.toFixed?.(2) || h1_auto || 0),
        v2_auto: Number(v2_auto?.toFixed?.(2) || v2_auto || 0),
        h2_auto: Number(h2_auto?.toFixed?.(2) || h2_auto || 0),
      },
      where: {
        id: Number(id),
      },
    });

    res
      .status(200)
      .json({ message: "FuelLoad updated successfully", data: updated });
  } catch (err) {
    console.error("Update FuelLoad Error :", err);
    res
      .status(500)
      .json({ message: "Update FuelLoad error", error: err.message });
  }
};

export const deleteFuelLoad = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.fuel_load.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: `FuelLoad id ${id} deleted successfully.`,
      data: deleted,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: `FuelLoad with id ${id} not found.`,
      });
    }
    console.error("Delete FuelLoad Error:", err);
    res
      .status(500)
      .json({ message: "Delete FuelLoad Error", error: err.message });
  }
};
