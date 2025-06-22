import jwt from 'jsonwebtoken';
import { env } from '../config/envConfig';
import { JwtPayloadToken } from '../interfaces/pendaftaranInterface';

type StringValue =
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;

export const generateAccessToken = (payload: JwtPayloadToken) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as StringValue });
};

export const generateRefreshToken = (payload: JwtPayloadToken) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as StringValue });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
