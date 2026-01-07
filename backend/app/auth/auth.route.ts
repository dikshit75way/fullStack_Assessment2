
import { Router } from "express";
import * as authController from "./auth.controller";
import { authLimiter } from "../common/middleware/rate-limiter.middleware";
import passport from "passport";
import * as authValidation from "./auth.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.post("/register", authLimiter, authValidation.register, catchError, authController.register);
router.post(
  "/login",
  authLimiter,
  authValidation.login,
  catchError,
  passport.authenticate("login", { session: false }),
  authController.login
);
router.post("/refresh-token", authController.refreshToken);

export default router;
