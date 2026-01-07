import mongoose from "mongoose";
import { type IVehicle } from "./vehicle.dto";

const Schema = mongoose.Schema;

const VehicleSchema = new Schema<IVehicle>(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    plateNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Sedan", "SUV", "Luxury", "Truck", "Van"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true },
    features: [{ type: String }],
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("vehicle", VehicleSchema);
