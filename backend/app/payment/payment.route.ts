import express, { Router } from "express";
import * as paymentController from "./payment.controller";
import { authenticateJwt } from "../common/middleware/auth.middleware";
import * as paymentValidation from "./payment.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

// Webhook must be BEFORE authenticateJwt and use raw body
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.webhook);

router.use(authenticateJwt);

router.post("/checkout", paymentValidation.checkout, catchError, paymentController.checkout);
router.get("/status/:bookingId", paymentController.getPaymentStatus);
router.post("/confirm", paymentController.confirm);

export default router;
