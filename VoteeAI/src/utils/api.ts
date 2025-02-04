import axios, { AxiosError } from 'axios';
import logger from './logger';

const BASE_URL = 'https://wordle.votee.dev:8000';

export interface WordleGuessResponse {
  slot: number;
  guess: string;
  result: 'absent' | 'present' | 'correct';
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export const wordleApi = {
  guessDaily: async (guess: string, size: number = 5): Promise<WordleGuessResponse[]> => {
    const startTime = Date.now();
    try {
      const response = await axios.get<WordleGuessResponse[]>(
        `${BASE_URL}/daily?guess=${guess}${size ? `&size=${size}` : ''}`,
      );
      logger.info(`API Call - guessDaily(${guess}) took ${Date.now() - startTime}ms`);
      return response.data;
    } catch (error) {
      logger.error(`API Call - guessDaily(${guess}) failed after ${Date.now() - startTime}ms`);
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || err.message;
      throw new Error(`Failed to make guess daily: ${errorMessage}`);
    }
  },

  guessRandom: async (
    guess: string,
    size: number = 5,
    seed: number = 0,
  ): Promise<WordleGuessResponse[]> => {
    const startTime = Date.now();
    try {
      const response = await axios.get<WordleGuessResponse[]>(
        `${BASE_URL}/random?guess=${guess}&size=${size}&seed=${seed}`,
      );
      logger.info(`API Call - guessRandom(${guess}) took ${Date.now() - startTime}ms`);
      return response.data;
    } catch (error) {
      logger.error(`API Call - guessRandom(${guess}) failed after ${Date.now() - startTime}ms`);
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || err.message;
      throw new Error(`Failed to make guess random: ${errorMessage}`);
    }
  },

  guessWord: async (word: string, guess: string): Promise<WordleGuessResponse[]> => {
    const startTime = Date.now();
    try {
      const response = await axios.get<WordleGuessResponse[]>(
        `${BASE_URL}/word/${word}?guess=${guess}`,
      );
      logger.info(`API Call - guessWord(${word}, ${guess}) took ${Date.now() - startTime}ms`);
      return response.data;
    } catch (error) {
      logger.error(
        `API Call - guessWord(${word}, ${guess}) failed after ${Date.now() - startTime}ms`,
      );
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || err.message;
      throw new Error(`Failed to make guess word: ${errorMessage}`);
    }
  },
};
