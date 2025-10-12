// Databases
// import pool from "../db.js"
import prisma from "../db.js";
import ModbusRTU from "modbus-serial";
import dotenv from "dotenv";

dotenv.config();

const serialPort =
  process.platform === "win32"
    ? process.env.MODBUS_PORT
    : process.env.MODBUS_PORT_LINUX;

const baudRate = Number(process.env.MODBUS_BAUD);

// Probe Config
export const writeProbeConfig = async (req, res) => {
  const { probe_id, register_address, write_value } = req.body;
  console.log(
    `probe_id: ${probe_id},address: ${register_address}, value: ${write_value}`
  );
  const client = new ModbusRTU();

  try {
    await client.connectRTUBuffered(serialPort, { baudRate });
    client.setID(Number(probe_id));
    // client.setID(0)
    client.setTimeout(1000);

    console.log("Connected to Modbus RTU");
    try {
      const writeResult = await client.writeRegister(
        Number(register_address),
        Number(write_value)
      );
      console.log("Write response:", writeResult);
      res.json({ message: "Write success", result: writeResult });
    } catch (err) {
      console.error("Write Probe Error :", err.message);
      res
        .status(500)
        .json({ message: "Write Probe Error", error: err.message });
    }
  } catch (err) {
    console.error("Com Port Error:", err.message);
    res
      .status(500)
      .json({ message: "Com Connection Error", error: err.message });
  } finally {
    try {
      await client.close();
      console.log("Port Closed Successfully");
    } catch (err) {
      console.error("Port Closed Unsuccess:", err.message);
    }
  }
};

export const readProbeConfig = async (req, res) => {
  console.log("read prober config");
  const {
    probe_id,
    address_start,
    address_length,
    row_count,
    function_code,
    format,
    scale = 1,
  } = req.body;

  const client = new ModbusRTU();

  // จัด byte order → float
  function parseFloatFromWords(words, format) {
    let w0 = words[0];
    let w1 = words[1];

    let w0_hi = (w0 >> 8) & 0xff;
    let w0_lo = w0 & 0xff;
    let w1_hi = (w1 >> 8) & 0xff;
    let w1_lo = w1 & 0xff;

    let buf;
    switch (format) {
      case "AB CD":
        buf = Buffer.from([w0_hi, w0_lo, w1_hi, w1_lo]);
        break;
      case "CD AB":
        buf = Buffer.from([w1_hi, w1_lo, w0_hi, w0_lo]);
        break;
      case "BA DC":
        buf = Buffer.from([w0_lo, w0_hi, w1_lo, w1_hi]);
        break;
      case "DC BA":
        buf = Buffer.from([w1_lo, w1_hi, w0_lo, w0_hi]);
        break;
      default:
        buf = Buffer.from([w0_hi, w0_lo, w1_hi, w1_lo]);
    }
    return buf.readFloatBE(0);
  }

  // อ่านแบบแบ่ง chunk
  async function safeReadRegisters(
    client,
    func,
    start,
    length,
    maxPerRead = 20
  ) {
    let data = [];
    let remaining = length;
    let addr = start;

    while (remaining > 0) {
      const chunk = Math.min(remaining, maxPerRead);
      let result;
      if (func === "03") {
        result = await client.readHoldingRegisters(addr, chunk);
      } else {
        result = await client.readInputRegisters(addr, chunk);
      }
      data = data.concat(result.data);
      addr += chunk;
      remaining -= chunk;
    }
    return data;
  }

  try {
    await client.connectRTUBuffered(serialPort, { baudRate });
    client.setID(Number(probe_id));
    client.setTimeout(1000);

    console.log("✅ Connected to Modbus RTU");

    try {
      const totalLength = address_start + row_count * address_length;
      console.log(
        `request: start=${address_start}, rows=${row_count}, totalLength=${totalLength}`
      );

      // 👉 อ่านตั้งแต่ address 0 เสมอ
      const raw = await safeReadRegisters(
        client,
        function_code,
        0,
        totalLength,
        20
      );
      console.log("raw:", raw);

      const rows = [];
      for (let i = 0; i < row_count; i++) {
        if (address_length === 2) {
          const wordOffset = address_start + i * 2;
          const words = raw.slice(wordOffset, wordOffset + 2);
          const floatVal = parseFloatFromWords(words, format) * scale;

          rows.push({
            address: wordOffset,
            value: floatVal,
            length: address_length,
          });
        } else {
          const wordOffset = address_start + i;
          const rawVal = raw[wordOffset] * scale;

          rows.push({
            address: wordOffset,
            value: rawVal,
            length: address_length,
          });
        }
      }

      console.log("rows:", rows);
      res.json({ message: "Read success", rows });
    } catch (err) {
      console.error("🚨 Read Error:", err.message);
      res.status(500).json({ message: "Read Error", error: err.message });
    }
  } catch (err) {
    console.error("🚨 Com Port Error:", err.message);
    res
      .status(500)
      .json({ message: "Com Connection Error", error: err.message });
  } finally {
    try {
      await client.close();
      console.log("🔌 Port Closed Successfully");
    } catch (err) {
      console.error("⚠️ Port Closed Unsuccess:", err.message);
    }
  }
};

// Probe Settings
export const getProbeSettings = async (req, res) => {
  try {
    const settings = await prisma.probe_setting.findMany({
      include: {
        probe_type: {
          select: {
            probe_type_name: true,
          },
        },
      },
      orderBy: {
        probe_id: "asc",
      },
    });

    res.status(200).json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
};

export const addProbeSettings = async (req, res) => {
  try {
    const {
      probe_id,
      probe_type_id,
      oil_h_address,
      oil_h_scale,
      water_h_address,
      water_h_scale,
      temp_address,
      temp_scale,
      format,
      function_code,
      address_length,
    } = req.body;

    const newProbeSetting = await prisma.probe_setting.create({
      data: {
        probe_id: Number(probe_id),
        probe_type_id: Number(probe_type_id),
        oil_h_address: Number(oil_h_address),
        oil_h_scale: Number(oil_h_scale),
        water_h_address: Number(water_h_address),
        water_h_scale: Number(water_h_scale),
        temp_address: Number(temp_address),
        temp_scale: Number(temp_scale),
        format,
        function_code,
        address_length: Number(address_length),
      },
    });

    res.status(201).json({
      message: "Probe config add successfully",
      data: newProbeSetting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
};

export const deleteProbeSettings = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Delete Probe id :", id);
    const deleted = await prisma.probe_setting.delete({
      where: { probe_id: Number(id) },
    });
    res.json({
      message: "Probe config deleted successfully",
      data: deleted,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Probe ID not found" });
    }
    console.error(err);
    res.status(500).send("DB Error");
  }
};

export const updateProbeSettings = async (req, res) => {
  const { id } = req.params;
  const {
    probe_type_id,
    oil_h_address,
    oil_h_scale,
    water_h_address,
    water_h_scale,
    temp_address,
    temp_scale,
    format,
    function_code,
    address_length,
  } = req.body;
  try {
    const updated = await prisma.probe_setting.update({
      where: { probe_id: Number(id) },
      data: {
        probe_type_id: Number(probe_type_id),
        oil_h_address: Number(oil_h_address),
        oil_h_scale: Number(oil_h_scale),
        water_h_address: Number(water_h_address),
        water_h_scale: Number(water_h_scale),
        temp_address: Number(temp_address),
        temp_scale: Number(temp_scale),
        format,
        function_code,
        address_length: Number(address_length),
      },
    });
    res.json({
      message: "Probe config updated successfully!",
      data: updated,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Probe ID not found" });
    }
    console.error(err);
    res.status(500).send("DB Error");
  }
};

// Probe Types
export const getProbeTypes = async (req, res) => {
  try {
    const data = await prisma.probe_type.findMany();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
};
