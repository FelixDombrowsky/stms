import { writeTankData, closeInflux } from "./services/influxServices.js";

// mock tank data
const tanks = [
  {
    tank_code: "001",
    capacity_l: 3000,
    status: "normal",
  },
  {
    tank_code: "002",
    capacity_l: 2500,
    status: "normal",
  },
  {
    tank_code: "003",
    capacity_l: 2000,
    status: "normal",
  },
];

// จำลองข้อมูลในช่วงการโหลด
const simulateFuelLoad = async () => {
  const startTime = new Date();
  for (let minute = 0; minute <= 10; minute++) {
    const timestamp = new Date(startTime.getTime() + minute * 60000);

    for (const tank of tanks) {
      const oil_volume = Math.min(
        tank.capacity_l,
        500 + minute * 200 + Math.random() * 50
      );
      const oil_height = (oil_volume / tank.capacity_l) * 3000; // สมมติ mm
      const fuel_percent = (oil_volume / tank.capacity_l) * 100;

      await writeTankData({
        tank_code: tank.tank_code,
        oil_height,
        water_height: Math.random() * 20,
        oil_volume,
        water_volume: Math.random() * 5,
        fuel_percent,
        water_percent: Math.random(),
        temp: 28 + Math.random() * 2,
        capacity_l: tank.capacity_l,
        status: tank.status,
        timestamp,
      });
    }

    console.log(`⏱️ Mock minute ${minute} inserted`);
  }

  await closeInflux();
  console.log("✅ Mock data write complete");
};

simulateFuelLoad().catch(console.error);
