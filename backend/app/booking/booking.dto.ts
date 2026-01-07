import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface IBooking extends BaseSchema {
  userId: string | Types.ObjectId;
  vehicleId: string | Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  cancellationReason?: string;
  refundAmount?: number;
}
