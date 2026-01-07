import { body } from "express-validator";

export const createVehicle = [
  body("brand").isString().notEmpty().withMessage("Brand is required"),
  body("model").isString().notEmpty().withMessage("Model is required"),
  body("year").isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Invalid year"),
  body("plateNumber").isString().notEmpty().withMessage("Plate number is required"),
  body("type")
    .isIn(["Sedan", "SUV", "Luxury", "Truck", "Van"])
    .withMessage("Invalid vehicle type"),
  body("pricePerDay").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("image").optional().isString().withMessage("Image path must be a string"),
  body("features").isArray().withMessage("Features must be an array"),
];

export const updateVehicle = [
  body("brand").optional().isString(),
  body("model").optional().isString(),
  body("year").optional().isInt({ min: 1900 }),
  body("plateNumber").optional().isString(),
  body("type").optional().isIn(["Sedan", "SUV", "Luxury", "Truck", "Van"]),
  body("pricePerDay").optional().isFloat({ min: 0 }),
  body("image").optional().isString(),
  body("status").optional().isIn(["available", "rented", "maintenance"]),
  body("features").optional().isArray(),
];
