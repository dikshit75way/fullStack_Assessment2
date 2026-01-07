import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface IVehicle extends BaseSchema {
  owner: string | Types.ObjectId;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  type: "Sedan" | "SUV" | "Luxury" | "Truck" | "Van";
  status: "available" | "rented" | "maintenance";
  pricePerDay: number;
  image: string;
  features: string[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface IFilterVehicles {
  status?: "available" | "rented" | "maintenance";
  type?: "Sedan" | "SUV" | "Luxury" | "Truck" | "Van";
}
