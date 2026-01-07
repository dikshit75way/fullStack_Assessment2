import { body } from "express-validator";

export const checkout = [
  body("bookingId").isMongoId().withMessage("Invalid booking ID"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("paymentMethod").isString().notEmpty().withMessage("Payment method is required"),
];
