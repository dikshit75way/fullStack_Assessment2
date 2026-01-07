import { Router } from "express";
import * as bookingController from "./booking.controller";
import { authenticateJwt } from "../common/middleware/auth.middleware";
import * as bookingValidation from "./booking.validation";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.use(authenticateJwt);

router.post("/", bookingValidation.createBooking, catchError, bookingController.createBooking);
router.get("/my", bookingController.getMyBookings);
router.get("/:id", bookingController.getBookingById);
router.post("/:id/cancel", bookingValidation.cancelBooking, catchError, bookingController.cancelBooking);

export default router;
