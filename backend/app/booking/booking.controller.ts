import * as bookingService from "./booking.service";
import * as userService from "../user/user.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw createHttpError(401, "User not authenticated");

    // KYC check
    const user = await userService.getUserById(userId);
    if (!user || user.kycStatus !== "verified") {
      throw createHttpError(403, "KYC verification is required to book a vehicle.");
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
    if (!userId) throw createHttpError(401, "User not authenticated");

    const bookings = await bookingService.getMyBookings(userId);
    res.send(createResponse(bookings, "Bookings fetched"));
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      throw createHttpError(404, "Booking not found");
    }

    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (
      booking.userId.toString() !== userId?.toString() &&
      userRole !== "admin"
    ) {
      throw createHttpError(403, "You are not authorized to view this booking");
    }

    res.send(createResponse(booking, "Booking details fetched"));
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { reason } = req.body;
    const bookingData = await bookingService.getBookingById(req.params.id);

    if (!bookingData) {
      throw createHttpError(404, "Booking not found");
    }

    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (
      bookingData.userId.toString() !== userId?.toString() &&
      userRole !== "admin"
    ) {
      throw createHttpError(403, "You are not authorized to cancel this booking");
    }

    const booking = await bookingService.cancelBooking(req.params.id, reason);
    res.send(createResponse(booking, "Booking cancelled"));
  }
);
