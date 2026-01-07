import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../../user/user.schema";
import { type IUser } from "@/user/user.dto";
import type { AuthTokenPayload } from "@/auth/auth.dto";
export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateJwt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing authorization header" });
  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const payload: any = jwt.verify(token, secret);
    // attach user minimal info
    const user = await UserModel.findById(payload.sub).select("-password").lean();
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
















