import { type  Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";


export const requireRole = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return createHttpError(401, "Unauthorized");
    if (!roles.includes(user.role)) return createHttpError(403, "Forbidden");
    next();
  };
};