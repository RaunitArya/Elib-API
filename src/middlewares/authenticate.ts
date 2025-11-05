import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || !parts[0] || !/^Bearer$/i.test(parts[0])) {
    return next(createHttpError(401, "Malformed authorization header"));
  }

  const token = parts[1];

  try {
    if (!token) {
      return next(createHttpError(401, "Authorization token is required"));
    }
    const decoded = jwt.verify(token, config.jwtSecret as string);

    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
