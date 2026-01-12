import * as paymentService from "./payment.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw createHttpError(401, "User not authenticated");

  const payment = await paymentService.initiatePayment({
    ...req.body,
    userId,
  });
  res.send(createResponse(payment, "Payment initiated"));
});

export const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentByBookingId(req.params.bookingId);
  res.send(createResponse(payment, "Payment status fetched"));
});
