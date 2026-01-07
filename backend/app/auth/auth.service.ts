
import * as userService from "../user/user.service";
import * as jwtService from "../common/service/passport-jwt.service";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { IRegisterDto } from "./auth.dto";

export const register = async (data: IRegisterDto) => {
  const existing = await userService.getUserByEmail(data.email);
  if (existing) throw createError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await userService.createUser({ ...data, password: hashedPassword });
  const userPlain = user.toObject();
  const tokens = jwtService.createUserTokens(userPlain);
  await userService.updateUser(userPlain._id as string, { refreshToken: tokens.refreshToken });
  return { user: userPlain, tokens };
};




export const refresh = async (refreshToken: string) => {
    const decoded = jwtService.verifyToken(refreshToken);
    const user = await userService.getUserById(decoded._id!);
    if (!user || user.refreshToken !== refreshToken) throw createError(401, "Invalid refresh token");

    const tokens = jwtService.createUserTokens(user);
    await userService.updateUser(user._id as string, { refreshToken: tokens.refreshToken });
    return tokens;
}
