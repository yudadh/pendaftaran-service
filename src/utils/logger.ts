import winston from "winston";
import { env } from "../config/envConfig";

// Logger instance
export const logger = winston.createLogger({
   level: env.NODE_ENV === "development" ? "debug" : "info",
   format: winston.format.combine(
      env.NODE_ENV === "development" ? winston.format.colorize() : winston.format.uncolorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message, timestamp, stack }) => `${timestamp} [${level}]: ${stack || message}`)
   ),
   transports: [
      new winston.transports.Console(), 
      // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log error ke file
      // new winston.transports.File({ filename: 'logs/combined.log' }), // Log semua level
   ],
});
