import mongoose from "mongoose";
import { type IPayment } from "./payment.dto";

const Schema = mongoose.Schema;

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId , ref: "booking", required: true },
    userId: { type: Schema.Types.ObjectId , ref: "user", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("payment", PaymentSchema);
