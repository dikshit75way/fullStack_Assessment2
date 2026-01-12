import { body } from "express-validator";

export const createBooking = [
  body("vehicleId").isMongoId().withMessage("Invalid vehicle ID"),
  body("startDate").isISO8601().withMessage("Start date must be a valid date"),
  body("endDate").isISO8601().withMessage("End date must be a valid date"),
  body("totalAmount").isFloat({ min: 0 }).withMessage("Total amount must be a positive number"),
];

export const cancelBooking = [
  body("reason").isString().notEmpty().withMessage("Cancellation reason is required"),
];



