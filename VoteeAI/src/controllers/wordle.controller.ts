import { Request, Response } from 'express';
import { WordleService } from '../services/wordle.service';

export class WordleController {
  private wordleService: WordleService;

  constructor() {
    this.wordleService = new WordleService();
  }

  public solve = async (req: Request, res: Response): Promise<void> => {
    try {
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
      if (size < 5 || size > 18) {
        res.status(400).json({ error: 'Invalid word size', message: 'Word size must be between 5 and 18 characters' });
        return;
      }
      const result = await this.wordleService.makeGuess(size);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to solve Wordle puzzle' , message: (error as Error).message });
    }
  };
} 