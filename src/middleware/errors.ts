// import { response } from "@/utils/response.js";
import { notImplementedError } from "@/utils/errors/common.js";
import { HttpError } from "@/utils/errors/HttpError.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

// Global Error Handler Middleware
export const globalErrorHandler = (
  err: HttpError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error("Error:", err.message, err.name);
  }
  const responseStatus = err instanceof HttpError ? err.status : 500;
  switch (err.name) {
    case "SequelizeConnectionError":
      res.status(responseStatus).json({
        success: false,
        message: "data base connection error please try again later",
      });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({
        success: false,
        message: err.name,
      });
      break;
    default:
      res.status(responseStatus).json({ success: false, message: err.message });
      break;
  }
};

// Middleware for handling requests that don't match any available router
export const endpointNotImplemented: RequestHandler = (_req, _res, next) => {
  next(notImplementedError());
};
