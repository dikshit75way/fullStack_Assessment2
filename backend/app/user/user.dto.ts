import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  toObject: any;
  name: string;
  email: string;
  password?: string;
  refreshToken?: string;
  role: "user" | "admin";
  kycStatus: "none" | "pending" | "verified" | "rejected";
  driverLicense?: string;
  phoneNumber?: string;
}

