import { JwtPayload } from "jsonwebtoken";

export interface ILoginDto {
    email: string;
    password: string;
}

export interface IRegisterDto {
    name: string;
    email: string;
    password: string;
}

export interface IRefreshTokenDto {
    refreshToken: string;
}

export interface AuthTokenPayload extends JwtPayload {
  _id: string;
  email: string;
  role?: string;
}
