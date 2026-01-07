import { Router } from "express";
import * as vehicleController from "./vehicle.controller";
import { authenticateJwt } from "../common/middleware/auth.middleware";
import { requireRole } from "../common/middleware/role-auth.middleware";
import * as vehicleValidation from "./vehicle.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

import { upload } from "../common/middleware/upload.middleware";

const router = Router();

router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getVehicleById);

// Protected Admin/Fleet Manager routes
router.post("/", authenticateJwt, requireRole(["admin"]), upload.single("image"), vehicleValidation.createVehicle, catchError, vehicleController.createVehicle);
router.patch("/:id", authenticateJwt, requireRole(["admin"]), upload.single("image"), vehicleValidation.updateVehicle, catchError, vehicleController.updateVehicle);
router.delete("/:id", authenticateJwt, requireRole(["admin"]), vehicleController.deleteVehicle);

export default router;
