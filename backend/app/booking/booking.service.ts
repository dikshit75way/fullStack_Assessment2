import Booking from "./booking.schema";
import { type IBooking } from "./booking.dto";
import { addBookingTimeoutJob } from "../common/queue/booking.queue";
import * as vehicleService from "../vehicle/vehicle.service";
import createHttpError from "http-errors";

export const createBooking = async (data: IBooking) => {
  // Overlap check
  const overlap = await Booking.findOne({
    vehicleId: data.vehicleId,
    status: { $in: ["confirmed", "active", "pending"] },
    // Check for overlap: Existing.Start < New.End AND Existing.End > New.Start
    // We use strict inequalities ($lt, $gt) to allow "touching" dates (e.g. one ends on Jan 2, next starts on Jan 2)
    $or: [
      { startDate: { $lt: data.endDate }, endDate: { $gt: data.startDate } },
    ],
  });

  if (overlap) {
    throw createHttpError(409, "Vehicle is already booked for these dates.");
  }

  const booking = await Booking.create({ ...data, status: "pending" });
  
  // Schedule auto-cancellation after 15 minutes
  await addBookingTimeoutJob(booking._id.toString());

  return booking;
};

export const getMyBookings = async (userId: string) => {
  return await Booking.find({ userId }).populate("vehicleId").lean();
};

export const getBookingById = async (id: string) => {
  return await Booking.findById(id).populate("vehicleId").lean();
};

export const updateBookingStatus = async (id: string, status: IBooking["status"]) => {
  return await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
};

export const cancelBooking = async (id: string, reason: string) => {
  const booking = await Booking.findById(id);
  if (!booking) throw createHttpError(404, "Booking not found");

  if (booking.status === "cancelled") throw createHttpError(400, "Booking already cancelled");

  // Calculate Refund
  let refundAmount = 0;
  if (booking.status === "confirmed") { // Only confirmed bookings get refunds (pending usually means unpaid)
      const now = new Date();
      const start = new Date(booking.startDate);
      const diffTime = start.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays > 3) {
          refundAmount = booking.totalAmount; // 100% refund
      } else if (diffDays >= 1) {
          refundAmount = booking.totalAmount * 0.5; // 50% refund
      } else {
          refundAmount = 0; // No refund if cancelled less than 24h before
      }
  }

  return await Booking.findByIdAndUpdate(
    id,
    { status: "cancelled", cancellationReason: reason, refundAmount },
    { new: true }
  ).lean();
};
