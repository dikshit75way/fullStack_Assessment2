import { body } from "express-validator";

export const verifyKYC = [
  body("driverLicense").isString().notEmpty().withMessage("Driver license is required"),
  body("phoneNumber").isString().notEmpty().withMessage("Phone number is required"),
];
