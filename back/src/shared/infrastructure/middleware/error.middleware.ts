import { Request, Response, NextFunction } from "express";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    err,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Domain errors
  if (err.message.includes("not found")) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }

  // Validation errors
  if (err.message.includes("Invalid") || err.message.includes("must be")) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  // Default error
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
};

export { logger };
