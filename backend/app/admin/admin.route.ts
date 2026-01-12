import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as userController from "../user/user.controller";
import * as vehicleController from "../vehicle/vehicle.controller";
import * as vehicleService from "../vehicle/vehicle.service";
import * as userValidation from "../user/user.validation";
import * as vehicleValidation from "../vehicle/vehicle.validation";
import { authenticateJwt } from "../common/middleware/auth.middleware";
import { requireRole } from "../common/middleware/role-auth.middleware";
import { upload } from "../common/middleware/upload.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";
import { createResponse } from "../common/helper/response.helper";
import createHttpError from "http-errors";

const router = Router();

// Apply global admin protection
router.use(authenticateJwt, requireRole(["admin"]));

/**
 * USER MANAGEMENT
 */
router.get("/users", userController.getAllUsers);
router.patch("/users/kyc/:id", userController.updateKYCStatus);

/**
 * FLEET MANAGEMENT
 */
router.post("/vehicles", upload.single("image"), vehicleValidation.createVehicle, catchError, vehicleController.createVehicle);
router.patch("/vehicles/:id", upload.single("image"), vehicleValidation.updateVehicle, catchError, vehicleController.updateVehicle);
router.delete("/vehicles/:id", vehicleController.deleteVehicle);

/**
 * LIVE TRACKING
 */
router.get("/tracking/:vehicleId", asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.vehicleId);
  if (!vehicle) throw createHttpError(404, "Vehicle not found");

  // Mocking LIVE GPS data by adding random movement (jitter)
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
