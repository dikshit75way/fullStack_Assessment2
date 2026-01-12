import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as vehicleService from "../vehicle/vehicle.service";
import { createResponse } from "../common/helper/response.helper";
import createHttpError from "http-errors";

const router = Router();

router.get("/:vehicleId", asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.vehicleId);
  if (!vehicle) throw createHttpError(404, "Vehicle not found");

  // Mocking LIVE GPS data by adding random movement (jitter)
  // Simulate movement within ~0.005 degrees (approx 500m radius)
  const jitter = 0.005;
  const latOffset = (Math.random() - 0.5) * jitter;
  const lngOffset = (Math.random() - 0.5) * jitter;

  const trackingData = {
    vehicleId: vehicle._id,
    lat: (vehicle.currentLocation?.lat ?? 40.7128) + latOffset,
    lng: (vehicle.currentLocation?.lng ?? -74.0060) + lngOffset,
    updatedAt: new Date(),
  };

  res.send(createResponse(trackingData, "Tracking data fetched"));
}));

export default router;
