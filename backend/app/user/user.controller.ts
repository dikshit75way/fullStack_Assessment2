
import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw createHttpError(401, "User not authenticated");
  const user = await userService.getUserById(userId);
  res.send(createResponse(user, "User found"));
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw createHttpError(401, "User not authenticated");
  const user = await userService.getUserById(userId);
  res.send(createResponse(user, "User profile fetched"));
});

export const verifyKYC = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw createHttpError(401, "User not authenticated");
  const { driverLicense, phoneNumber } = req.body;
  const updateData = {
    driverLicense,
    phoneNumber,
    kycStatus: "pending" as const,
  };
  const user = await userService.updateUser(userId, updateData);
  res.send(createResponse(user, "KYC verification initiated"));
});

export const updateKYCStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!id) throw createHttpError(400, "User ID is required");
  const user = await userService.updateUser(id, { kycStatus: status });
  res.send(createResponse(user, `KYC status updated to ${status}`));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.send(createResponse(user, "User created"));
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.send(createResponse(users, "All users fetched"));
});
