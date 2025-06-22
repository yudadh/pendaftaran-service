import dotenv from "dotenv";
import crypto from "crypto"

if (process.env.NODE_ENV !== 'production') {
   dotenv.config();
}

const secretKey = crypto.randomBytes(32)
const secretKeyHex = secretKey.toString('hex')

export const env = {
   JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
   JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
   JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
   PORT: process.env.PORT || 3000,
   NODE_ENV: process.env.NODE_ENV || "production",
   SECRET_CRYPTO_KEY: process.env.SECRET_CRYPTO_KEY || secretKeyHex,
   MAPBOX_API_KEY: process.env.MAPBOX_API_KEY || "api_key",
   DOCUMENT_SERVICE_URL: process.env.DOCUMENT_SERVICE_URL || "http://localhost:3002/dokumen",
   PERIODE_SERVICE_URL: process.env.PERIODE_SERVICE_URL || "http://localhost:3004/periode"
};
