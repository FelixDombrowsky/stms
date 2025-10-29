import prisma from "../db.js"
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

// Fuel level
