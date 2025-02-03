import * as fs from 'fs';
import * as path from 'path';
import { wordleApi } from '../utils/api';
export interface GuessResult {
    correct: boolean;
    pattern: ('correct' | 'present' | 'absent')[];
}

export class WordleService {
    private words: string[] = [];
    private currentWord: string = '';
    private WORD_LENGTH = 5;
    private readonly ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

    constructor() {
        this.loadWords();
    }

    private loadWords(): void {
        try {
            const wordList = fs.readFileSync(path.join(__dirname, '../..', 'eng_words.txt'), 'utf-8');
            this.words = wordList
                .split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length === this.WORD_LENGTH)
                .filter(word => /^[a-z]+$/.test(word)); // Only allow letters a-z
        } catch (error) {
            console.error('Error loading word list:', error);
            this.words = [];
        }
    }

    public async makeGuess(wordLength: number = this.WORD_LENGTH): Promise<{ guesses: string[], success: boolean, correctWord: string, attempts: number }> {
        let wordRegex = new RegExp(`[a-z]{${wordLength}}`);
        this.WORD_LENGTH = wordLength;
        let attempts = 0;
        let guessedWords: string[] = [];
        let correctChar: { [key: string]: string } = {};
        let isSuccess = false;
        let matchedWords: string[] = [];
        let correctWord: string = '';
        
        while (!isSuccess) {

            if(Object.keys(correctChar).length === wordLength) {
                isSuccess = true;
                correctWord = Object.values(correctChar).join('');
                break;
            }

            if(attempts === 0) {
                this.loadWords();
                this.currentWord = this.ALPHABET.slice(0, wordLength);
            } else {
                this.currentWord = matchedWords.shift() || '';
            }
            console.log('CURRENT WORD ', this.currentWord);
            const guessResult = await wordleApi.guessDaily(this.currentWord, wordLength);

            guessResult.forEach(result => {
                if(result.result === 'correct') {
                    correctChar[result.slot] = result.guess;
                }
            });
            wordRegex = new RegExp(this.generateRegex(correctChar));

            if(attempts === 0) {
                matchedWords = this.words.filter(word => wordRegex.test(word));
            } else {
                matchedWords = matchedWords.filter(word => wordRegex.test(word));
            }

            guessedWords.push(this.currentWord);
            attempts++;
        }

        return { guesses: guessedWords, success: isSuccess, correctWord: correctWord, attempts: attempts };
    }

    private generateRegex(correctChar: { [key: string]: string }): string {
        let regexParts: string[] = [];
        for(let i = 0; i < this.WORD_LENGTH; i++) {
            if(correctChar[i]) {
                regexParts.push(correctChar[i]);
            } else {
                regexParts.push('.');
            }
        }
        return `^${regexParts.join('')}$`;
    }
}
