import { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../utils/appError";

export const roleMiddleware =
   (allowedRoles: string[]): RequestHandler =>
   (req: Request, res: Response, next: NextFunction): void => {
      const user = req.user;
      if (!user || !allowedRoles.includes(user.role)) {
         logger.warn("Forbidden access");
         return next(new AppError("Forbidden Access", 403))
      }

      next();
   };