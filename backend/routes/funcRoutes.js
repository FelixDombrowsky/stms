import express from "express"

import { getFuelLoads } from "../controllers/funcControl.js"

const router = express.Router()

// Fuel Load
router.get("/fuelLoad/all", getFuelLoads)

export default router
