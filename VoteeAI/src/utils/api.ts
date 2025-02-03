import axios, { AxiosError } from 'axios';

const BASE_URL = 'https://wordle.votee.dev:8000';

export interface WordleGuessResponse {
  slot: number;
  guess: string;
  result: 'absent' | 'present' | 'correct';
}

export const wordleApi = {
  guessDaily: async (guess: string, size: number = 5): Promise<WordleGuessResponse[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/daily?guess=${guess}${size ? `&size=${size}` : ''}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.data || err.message;
      throw new Error(`Failed to make guess daily: ${errorMessage}`);
    }
  },

  guessRandom: async (guess: string): Promise<WordleGuessResponse[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/random?guess=${guess}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.data || err.message;
      throw new Error(`Failed to make guess random: ${errorMessage}`);
    }
  },

  guessWord: async (word: string, guess: string): Promise<WordleGuessResponse[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/word/${word}?guess=${guess}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.data || err.message;
      throw new Error(`Failed to make guess word: ${errorMessage}`);
    }
  }
};
