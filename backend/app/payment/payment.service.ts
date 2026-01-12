import Stripe from "stripe";
import Payment from "./payment.schema";
import { type IPayment } from "./payment.dto";
import * as bookingService from "../booking/booking.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-01-27.acacia" as any,
});

export const initiatePayment = async (data: Partial<IPayment>) => {
  const { amount, currency = "usd", bookingId, userId } = data;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round((amount || 0) * 100), // Stripe expects cents
    currency: currency.toLowerCase(),
    metadata: { bookingId: bookingId?.toString() || "", userId: userId?.toString() || "" },
  });

  const payment = await Payment.create({
    ...data,
    status: "pending",
    stripePaymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });

  return payment;
};

export const getPaymentByBookingId = async (bookingId: string) => {
  return await Payment.findOne({ bookingId }).lean();
};

export const handleWebhook = async (signature: string | string[], payload: any) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  console.log(">>> [Webhook] Verifying payload with secret length:", endpointSecret.length);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature as string,
      endpointSecret
    );
    console.log(">>> [Webhook] Event verified:", event.type);
  } catch (err: any) {
    console.error("!!! [Webhook] Signature verification failed:", err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata.bookingId;
    console.log(">>> [Webhook] Payment succeeded for booking:", bookingId);
    
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: "success", transactionId: paymentIntent.id }
    );
    
    if (bookingId) {
      const updated = await bookingService.updateBookingStatus(bookingId, "confirmed");
      console.log(">>> [Webhook] Booking status updated:", updated?.status);
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const failedIntent = event.data.object as Stripe.PaymentIntent;
    console.log(">>> [Webhook] Payment failed for intent:", failedIntent.id);
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: failedIntent.id },
      { status: "failed" }
    );
  }

  return { received: true };
};

export const confirmPaymentIntent = async (paymentIntentId: string) => {
  console.log(">>> [Manual Confirm] Verifying intent:", paymentIntentId);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const bookingId = paymentIntent.metadata.bookingId;
    
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: "success", transactionId: paymentIntent.id }
    );
    
    if (bookingId) {
      await bookingService.updateBookingStatus(bookingId, "confirmed");
      return { success: true, status: "confirmed" };
    }
  }

  return { success: false, status: paymentIntent.status };
};
