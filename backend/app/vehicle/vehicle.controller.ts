import * as vehicleService from "./vehicle.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import { type IFilterVehicles } from "./vehicle.dto";
import createHttpError from "http-errors";

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const image = req.file ? `/uploads/vehicles/${req.file.filename}` : undefined;
  if (!image) { 
    throw createHttpError(400, "Image is required");
  }
  
  const vehicleData = { ...req.body, image };
  const vehicle = await vehicleService.createVehicle(vehicleData, userId);
  res.send(createResponse(vehicle, "Vehicle added to fleet"));
});

export const getVehicles = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, startDate, endDate } = req.query;
  const filters: IFilterVehicles = {};
  
  if (typeof status === "string") filters.status = status as IFilterVehicles["status"];
  if (typeof type === "string") filters.type = type as IFilterVehicles["type"];
  if (typeof startDate === "string") filters.startDate = startDate;
  if (typeof endDate === "string") filters.endDate = endDate;

  const vehicles = await vehicleService.getAllVehicles(filters);
  res.send(createResponse(vehicles, "Vehicles fetched"));
});

export const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  res.send(createResponse(vehicle, "Vehicle details fetched"));
});

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const image = req.file ? `/uploads/vehicles/${req.file.filename}` : undefined;
  const updateData = { ...req.body };
  if (image) updateData.image = image;
  
  const vehicle = await vehicleService.updateVehicle(req.params.id, updateData);
  res.send(createResponse(vehicle, "Vehicle updated"));
});

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  await vehicleService.deleteVehicle(req.params.id);
  res.send(createResponse(null, "Vehicle deleted from fleet"));
});
