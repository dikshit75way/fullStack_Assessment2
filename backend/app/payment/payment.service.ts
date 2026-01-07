import Payment from "./payment.schema";
import { type IPayment } from "./payment.dto";
import * as bookingService from "../booking/booking.service";

export const initiatePayment = async (data: Partial<IPayment>) => {
  const payment = await Payment.create({
    ...data,
    status: "pending",
  });

  // Simulate dummy payment processing
  setTimeout(async () => {
    const success = Math.random() > 0.1; // 90% success rate
    const status = success ? "success" : "failed";
    const transactionId = success ? `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined;

    await Payment.findByIdAndUpdate(payment._id, { status, transactionId });

    if (success) {
      await bookingService.updateBookingStatus(data.bookingId as string, "confirmed");
    }
  }, 2000);

  return payment;
};

export const getPaymentByBookingId = async (bookingId: string) => {
  return await Payment.findOne({ bookingId }).lean();
};
