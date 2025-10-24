import express from "express"
import {
  getFuelLevel,
  getFuelLevelByRange,
} from "../services/influxServices.js"

const router = express.Router()

// GET /api/fuel/level?tank_code=001&limit=10
router.get("/level", getFuelLevel)
router.get("/levelByRange", getFuelLevelByRange)

export default router
