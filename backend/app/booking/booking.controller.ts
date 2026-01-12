import * as bookingService from "./booking.service";
import * as userService from "../user/user.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new Error("User not authenticated");

    // KYC check
    const user = await userService.getUserById(userId);
    if (!user || user.kycStatus !== "verified") {
      throw new Error("KYC verification is required to book a vehicle.");
    }

    const booking = await bookingService.createBooking({
      ...req.body,
      userId,
    });
    res.send(createResponse(booking, "Booking created successfully"));
  }
);

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new Error("User not authenticated");

    const bookings = await bookingService.getMyBookings(userId);
    res.send(createResponse(bookings, "Bookings fetched"));
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (
      booking.userId.toString() !== userId?.toString() &&
      userRole !== "admin"
    ) {
      res.status(403);
      throw new Error("You are not authorized to view this booking");
    }

    res.send(createResponse(booking, "Booking details fetched"));
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { reason } = req.body;
    const bookingData = await bookingService.getBookingById(req.params.id);

    if (!bookingData) {
      throw new Error("Booking not found");
    }

    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (
      bookingData.userId.toString() !== userId?.toString() &&
      userRole !== "admin"
    ) {
      res.status(403);
      throw new Error("You are not authorized to cancel this booking");
    }

    const booking = await bookingService.cancelBooking(req.params.id, reason);
    res.send(createResponse(booking, "Booking cancelled"));
  }
);
