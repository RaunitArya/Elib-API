import { type Request, type Response, type NextFunction } from "express";
import type { HttpError } from "http-errors";
import { config } from "../config/config.ts";

// Global Error Handler
export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    stackTrace: config.env === "development" ? err.stack : " ",
  });
};
