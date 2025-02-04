import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (err instanceof AppError) {
    logger.warn({
      message: err.message,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Unexpected errors
  logger.error({
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
