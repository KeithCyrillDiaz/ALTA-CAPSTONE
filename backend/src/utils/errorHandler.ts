import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { logger } from "./logger";

interface CustomError extends Error {
  status?: number;
}

const errorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const ERROR_MESSAGE = {
    code: "ERR_001",
    status: err.status || 500,
    message: err.message,
  };

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      code: "AUTH_002",
      message: "Token has expired",
    });
    return 
  }

  logger.error("Unhandled Error", {
    ERROR_MESSAGE,
    stack: err.stack,
  });

  res.status(ERROR_MESSAGE.status).json(ERROR_MESSAGE);
  return 
};

export default errorHandler;
