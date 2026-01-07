
import mongoose from "mongoose";
import {  type IUser } from "./user.dto";

const Schema = mongoose.Schema;


const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin",],
      default: "user",
    },
    password: { type: String, select: false },
    refreshToken: { type: String, required: false, default: "", select: false },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "verified", "rejected"],
      default: "none",
    },
    driverLicense: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);



export default mongoose.model<IUser>("user", UserSchema);
