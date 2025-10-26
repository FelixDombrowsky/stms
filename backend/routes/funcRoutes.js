import express from "express";

import {
  getFuelLoads,
  addFuelLoads,
  updateFuelLoad,
  deleteFuelLoad,
} from "../controllers/funcControl.js";

const router = express.Router();

// Fuel Load
router.get("/fuelLoad/all", getFuelLoads);
router.post("/fuelLoad", addFuelLoads);
router.put("/fuelLoad/:id", updateFuelLoad);
router.delete("/fuelLoad/:id", deleteFuelLoad);

export default router;
