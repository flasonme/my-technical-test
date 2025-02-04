import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const validateWordleInput = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const size = req.query.size ? parseInt(req.query.size as string) : 5;
    const seed = req.query.seed ? parseInt(req.query.seed as string) : 0;
    const maxSeed = req.query.maxSeed ? parseInt(req.query.maxSeed as string) : 100;

    // Validate size
    if (req.query.size && (isNaN(size) || size < 4 || size > 18)) {
      throw new AppError(400, 'Word size must be between 4 and 18 characters');
    }

    // Validate seed
    if (req.query.seed && (isNaN(seed) || seed < 0)) {
      throw new AppError(400, 'Seed must be a non-negative integer');
    }

    // Validate maxSeed
    if (req.query.maxSeed && (isNaN(maxSeed) || maxSeed < 0 || maxSeed > 1000)) {
      throw new AppError(400, 'MaxSeed must be between 0 and 1000');
    }

    // Add validated values to request
    req.query.size = size.toString();
    req.query.seed = seed.toString();
    req.query.maxSeed = maxSeed.toString();

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(400, 'Invalid input parameters'));
    }
  }
};
