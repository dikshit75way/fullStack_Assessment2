import { Router } from "express";
import * as userController from "./user.controller";
import { requireRole } from "../common/middleware/role-auth.middleware";
// import { authenticateJwt } from "../common/middleware/auth.middleware"; // Assuming this exists or will be created

import { authenticateJwt } from "../common/middleware/auth.middleware";

import * as userValidation from "./user.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.get("/profile", authenticateJwt, userController.getProfile);
router.post("/verify-kyc", authenticateJwt, userValidation.verifyKYC, catchError, userController.verifyKYC);
router.patch("/admin/kyc/:id", authenticateJwt, requireRole(["admin"]), userController.updateKYCStatus);
router.get("/", authenticateJwt, requireRole(["admin"]), userController.getAllUsers);
router.post("/", userController.createUser);
export default router;
