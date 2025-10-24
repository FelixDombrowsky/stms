import express from "express"

import { getFuelLoads, addFuelLoads } from "../controllers/funcControl.js"

const router = express.Router()

// Fuel Load
router.get("/fuelLoad/all", getFuelLoads)
router.post("/fuelLoad", addFuelLoads)

export default router
