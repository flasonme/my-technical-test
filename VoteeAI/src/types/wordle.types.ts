export interface GuessResult {
  guesses: string[];
  success: boolean;
  correctWord: string;
  attempts: number;
}

export interface SizeResults {
  [key: number]: GuessResult;
}

export interface RandomResults {
  [size: number]: {
    [seed: number]: GuessResult;
  };
}
