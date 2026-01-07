import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authenticateJwt } from "../common/middleware/auth.middleware";
import * as paymentValidation from "./payment.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.use(authenticateJwt);

router.post("/checkout", paymentValidation.checkout, catchError, paymentController.checkout);
router.get("/status/:bookingId", paymentController.getPaymentStatus);

export default router;
