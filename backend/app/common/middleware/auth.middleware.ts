import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../../user/user.schema";
import { type IUser } from "@/user/user.dto";
import type { AuthTokenPayload } from "@/auth/auth.dto";
import createHttpError from "http-errors";
export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateJwt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) createHttpError(401, "Missing authorization header");
  const token = authHeader?.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const payload: any = jwt.verify(token as string, secret);
    // attach user minimal info
    const user = await UserModel.findById(payload.sub).select("-password").lean();
    if (!user) return  createHttpError(401, "Invalid token");
    req.user = user;
    next();
    } catch (err) {
      return createHttpError(401, "Invalid token");
  }
};
















