import { Router } from "express";
import userRoutes from "./user/user.route";
import authRoutes from "./auth/auth.route";
import vehicleRoutes from "./vehicle/vehicle.route";
import bookingRoutes from "./booking/booking.route";
import adminRoutes from "./admin/admin.route";
import paymentRoutes from "./payment/payment.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);

export default router;

