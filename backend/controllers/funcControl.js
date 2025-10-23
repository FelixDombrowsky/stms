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
