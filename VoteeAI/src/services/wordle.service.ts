import * as fs from 'fs';
import * as path from 'path';
import { wordleApi } from '../utils/api';
import logger from '../utils/logger';

export interface WordleSolveResult {
  guesses: string[];
  success: boolean;
  correctWord: string;
  attempts: number;
}

export interface WordleAllSizesResult {
  [key: number]: WordleSolveResult;
}

export interface WordleRandomAllResult {
  [size: number]: {
    [seed: number]: WordleSolveResult;
  };
}

export interface GuessResult {
  correct: boolean;
  pattern: ('correct' | 'present' | 'absent')[];
}

export class WordleService {
  private words: string[] = [];
  private currentWord = '';
  private WORD_LENGTH = 5;
  private readonly ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  private readonly MAX_ATTEMPTS = 20;

  constructor() {
    this.loadWords();
  }

  private loadWords(): void {
    try {
      const wordList = fs.readFileSync(path.join(__dirname, '../..', 'eng_words.txt'), 'utf-8');
      this.words = wordList
        .split('\n')
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length === this.WORD_LENGTH)
        .filter((word) => /^[a-z]+$/.test(word)); // Only allow letters a-z
    } catch (error) {
      logger.error('Error loading word list:', error);
      this.words = [];
    }
  }

  public async makeGuess(wordLength: number = this.WORD_LENGTH): Promise<WordleSolveResult> {
    this.WORD_LENGTH = wordLength;
    const guessedWords: string[] = [];
    const correctChar: { [key: string]: string } = {};
    let matchedWords: string[] = [];
    let attempts = 0;

    while (attempts < this.MAX_ATTEMPTS) {
      // Make initial or subsequent guess
      if (attempts === 0) {
        this.loadWords();
        this.currentWord = this.ALPHABET.slice(0, wordLength);
      } else {
        if (!matchedWords.length) {
          throw new Error('No valid words found for the pattern');
        }
        this.currentWord = matchedWords[0];
        matchedWords = matchedWords.slice(1);
      }

      // Make guess and process results
      const guessResult = await wordleApi.guessDaily(this.currentWord, wordLength);
      guessedWords.push(this.currentWord);
      attempts++;

      // Update correct characters
      guessResult.forEach((result) => {
        if (result.result === 'correct') {
          correctChar[result.slot] = result.guess;
        }
      });

      // Check if word is found
      if (Object.keys(correctChar).length === wordLength) {
        const correctWord = Object.values(correctChar).join('');
        return {
          guesses: guessedWords,
          success: true,
          correctWord,
          attempts,
        };
      }

      // Filter possible words based on new pattern
      const wordRegex = new RegExp(this.generateRegex(correctChar));
      matchedWords =
        attempts === 1
          ? this.words.filter((word) => wordRegex.test(word))
          : matchedWords.filter((word) => wordRegex.test(word));
    }

    throw new Error('Maximum attempts reached');
  }

  private generateRegex(correctChar: { [key: string]: string }): string {
    const regexParts = Array(this.WORD_LENGTH).fill('.');
    Object.entries(correctChar).forEach(([index, char]) => {
      regexParts[Number(index)] = char;
    });
    return `^${regexParts.join('')}$`;
  }

  public async makeGuessAllSizes(): Promise<WordleAllSizesResult> {
    const sizes = Array.from({ length: 14 }, (_, i) => i + 5); // 5 to 18
    const results: WordleAllSizesResult = {};

    for (const size of sizes) {
      try {
        const result = await this.makeGuess(size);
        results[size] = result;
      } catch (error) {
        logger.error(`Error solving for size ${size}:`, error);
        results[size] = {
          guesses: [],
          success: false,
          correctWord: '',
          attempts: 0,
        };
      }
    }

    return results;
  }

  public async makeGuessRandom(size: number, seed: number): Promise<WordleSolveResult> {
    this.WORD_LENGTH = size;
    const guessedWords: string[] = [];
    const correctChar: { [key: string]: string } = {};
    let matchedWords: string[] = [];
    let attempts = 0;

    while (attempts < this.MAX_ATTEMPTS) {
      // Make initial or subsequent guess
      if (attempts === 0) {
        this.loadWords();
        this.currentWord = this.ALPHABET.slice(0, size);
      } else {
        if (!matchedWords.length) {
          throw new Error('No valid words found for the pattern');
        }
        this.currentWord = matchedWords[0];
        matchedWords = matchedWords.slice(1);
      }

      // Make guess and process results
      const guessResult = await wordleApi.guessRandom(this.currentWord, size, seed);
      guessedWords.push(this.currentWord);
      attempts++;

      // Update correct characters
      guessResult.forEach((result) => {
        if (result.result === 'correct') {
          correctChar[result.slot] = result.guess;
        }
      });

      // Check if word is found
      if (Object.keys(correctChar).length === size) {
        const correctWord = Object.values(correctChar).join('');
        return {
          guesses: guessedWords,
          success: true,
          correctWord,
          attempts,
        };
      }

      // Filter possible words based on new pattern
      const wordRegex = new RegExp(this.generateRegex(correctChar));
      matchedWords =
        attempts === 1
          ? this.words.filter((word) => wordRegex.test(word))
          : matchedWords.filter((word) => wordRegex.test(word));
    }

    throw new Error('Maximum attempts reached');
  }

  public async makeGuessRandomAllSizesAndSeeds(
    maxSeed: number = 100,
  ): Promise<WordleRandomAllResult> {
    const sizes = [4, 5, 6, 7, 8, 9, 10, 11];
    const results: WordleRandomAllResult = {};

    for (const size of sizes) {
      results[size] = {};
      for (let seed = 0; seed <= maxSeed; seed++) {
        try {
          const result = await this.makeGuessRandom(size, seed);
          results[size][seed] = result;
        } catch (error) {
          logger.error(`Error solving for size ${size} and seed ${seed}:`, error);
          results[size][seed] = {
            guesses: [],
            success: false,
            correctWord: '',
            attempts: 0,
          };
        }
      }
    }

    return results;
  }
}
