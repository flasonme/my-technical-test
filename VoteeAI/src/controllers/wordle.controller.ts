import { Request, Response } from 'express';
import { WordleService, WordleAllSizesResult, WordleSolveResult } from '../services/wordle.service';
import logger from '../utils/logger';

export class WordleController {
  private wordleService: WordleService;

  constructor() {
    this.wordleService = new WordleService();
  }

  public solve = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    try {
      const size = req.query.size ? parseInt(req.query.size as string) : 5;
      if (size < 5 || size > 18) {
        res.status(400).json({
          error: 'Invalid word size',
          message: 'Word size must be between 5 and 18 characters',
        });
        return;
      }
      const result = await this.wordleService.makeGuess(size);
      const responseTime = Date.now() - startTime;
      logger.info(`Controller - solve() took ${responseTime}ms`);
      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(`Controller - solve() failed after ${responseTime}ms`);
      res.status(500).json({
        error: 'Failed to solve Wordle puzzle',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public solveAllSizes = async (_req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    try {
      const result: WordleAllSizesResult = await this.wordleService.makeGuessAllSizes();
      const totalAttempts: number = Object.values(result).reduce(
        (sum: number, sizeResult: WordleSolveResult) => sum + sizeResult.attempts,
        0,
      ) as number;
      const responseTime = Date.now() - startTime;
      logger.info(`Controller - solveAllSizes() took ${responseTime}ms`);
      const response: WordleAllSizesResult & { totalAttempts: number } = {
        ...result,
        totalAttempts,
      };
      res.json(response);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(`Controller - solveAllSizes() failed after ${responseTime}ms`);
      res.status(500).json({
        error: 'Failed to solve Wordle puzzles for all sizes',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public solveRandom = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    try {
      const size = req.query.size ? parseInt(req.query.size as string) : 5;
      const seed = req.query.seed ? parseInt(req.query.seed as string) : 0;

      if (size < 5 || size > 18) {
        res.status(400).json({
          error: 'Invalid word size',
          message: 'Word size must be between 5 and 18 characters',
        });
        return;
      }

      const result = await this.wordleService.makeGuessRandom(size, seed);
      const responseTime = Date.now() - startTime;
      logger.info(`Controller - solveRandom() took ${responseTime}ms`);
      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(`Controller - solveRandom() failed after ${responseTime}ms`);
      res.status(500).json({
        error: 'Failed to solve random Wordle puzzle',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public solveRandomAllSizesAndSeeds = async (req: Request, res: Response): Promise<void> => {
    try {
      const maxSeed = req.query.maxSeed ? parseInt(req.query.maxSeed as string) : 100;
      const result = await this.wordleService.makeGuessRandomAllSizesAndSeeds(maxSeed);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to solve random Wordle puzzles for all sizes and seeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
