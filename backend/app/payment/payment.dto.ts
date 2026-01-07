import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface IPayment extends BaseSchema {
  bookingId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  amount: number;
  paymentMethod: string;
  status: "pending" | "success" | "failed";
  transactionId?: string;
}
