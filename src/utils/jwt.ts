import jwt from 'jsonwebtoken';
import { env } from '../config/envConfig';
import { JwtPayloadToken } from '../interfaces/pendaftaranInterface';

export const generateAccessToken = (payload: JwtPayloadToken) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
};

export const generateRefreshToken = (payload: JwtPayloadToken) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
