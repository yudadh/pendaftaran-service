import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ApiResponse } from "../interfaces/pendaftaranInterface";

// Middleware global untuk menangani error
export const errorHandler = (
   err: Error | AppError,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   let { statusCode, message } = err as AppError;

   // Jika error bukan instance dari AppError, set default
   if (!(err instanceof AppError)) {
      statusCode = 500;
      message = "Internal Server Error";
   }

   const response: ApiResponse<null> = {
      status: "error",
      data: null,
      meta: null,
      error: {
         message,
         code: statusCode,
      },
   };

   res.status(statusCode).json(response);
};
