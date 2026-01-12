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
  console.log("Payment status:", payment);
  res.send(createResponse(payment, "Payment status fetched"));
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  console.log(">>> Incoming Webhook Request");
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("!!! Missing Stripe Signature Header");
    throw createHttpError(400, "Missing Stripe signature");
  }

  try {
    const result = await paymentService.handleWebhook(sig, req.body);
    console.log(">>> Webhook Processed Successfully:", result);
    res.send(result);
  } catch (err: any) {
    console.error("!!! Webhook Controller Error:", err.message);
    res.status(400).send({ error: err.message });
  }
});

export const confirm = asyncHandler(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;
  const result = await paymentService.confirmPaymentIntent(paymentIntentId);
  res.send(createResponse(result, "Payment confirmation processed"));
});
