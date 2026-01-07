import mongoose from "mongoose";
import { type IBooking } from "./booking.dto";

const Schema = mongoose.Schema;

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId , ref: "user", required: true },
    vehicleId: { type: Schema.Types.ObjectId , ref: "vehicle", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    cancellationReason: { type: String },
    refundAmount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("booking", BookingSchema);
