import * as authService from "./auth.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { type IUser } from "../user/user.dto";
import { createUserTokens } from "@/common/service/passport-jwt.service";
import * as userService from "../user/user.service";
import {redisClient} from "@/common/service/redis.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.send(createResponse(result, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser ; // Cast to any to access _doc if it's a mongoose doc

  // Ensure we have a plain object
  const userPlain = user.toObject ? user.toObject() : user;
  
  const { password, ...userWithoutPassword } = userPlain;
  const tokens = createUserTokens(userWithoutPassword);

  // Store refreshToken in DB
  const update: Partial<IUser> & Record<string, string> = {
    refreshToken: tokens.refreshToken,
  };
  await userService.updateUser(userPlain._id!, update);

  // Store refreshToken in Redis
  const redisKey = `refreshToken:${userPlain._id}`;
  const ttlInSeconds = 7 * 24 * 60 * 60; // 7 days
  await redisClient.set(redisKey, tokens.refreshToken, "EX", ttlInSeconds);

  res.send(
    createResponse(
      {
        user: userWithoutPassword,
        tokens,
      },
      "Login successful"
    )
  );
});


export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.send(createResponse(result, "Token refreshed"));
});
