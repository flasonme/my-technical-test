# VoteeAI - Automated Wordle Solver

An automated system designed to solve Wordle-like puzzles using a systematic approach with regex pattern matching and dictionary filtering.

## Credits

- English Dictionary: [dwyl/english-words](https://github.com/dwyl/english-words) - Comprehensive English word list used for dictionary matching

## Overview

This project implements an automated solution for solving Wordle-like puzzles. It supports variable word lengths (default: 10 characters) and uses a combination of systematic character testing and pattern matching to efficiently guess words.

## Technical Implementation

### Core Algorithm

The solver uses a multi-step approach:
1. Initial Guess: Starts with a systematic first guess using characters from the alphabet
2. Pattern Recognition: Analyzes feedback from each guess to identify correct character positions
3. Dictionary Filtering: Maintains a filtered list of possible words based on confirmed characters
4. Regex Pattern Matching: Uses dynamic regex patterns to narrow down possible solutions

### Key Features

- Support for variable word lengths
- Efficient dictionary filtering
- Real-time feedback processing
- Multiple game modes (daily, random, specific word)

## API Integration

The system integrates with a Wordle API endpoint at `wordle.votee.dev:8000` supporting three main endpoints:
- `/daily` - Daily word challenge
- `/random` - Random word challenge
- `/word/{word}` - Specific word challenge

## Project Structure

```
src/
├── controllers/
│   └── wordle.controller.ts
├── routes/
│   └── wordle.routes.ts
├── services/
│   └── wordle.service.ts
├── types/
│   └── user.types.ts
└── utils/
    └── api.ts
```

## Current Solution Analysis

The current implementation uses a character-by-character approach with the following strategy:
1. Makes an initial guess using the first N characters of the alphabet
2. Records correct character positions
3. Filters a dictionary of words based on confirmed positions
4. Continues guessing from the filtered word list until the solution is found

### Strengths
- Simple and straightforward implementation
- Guaranteed to find the solution
- Efficient dictionary filtering

### Areas for Improvement
- Could implement information theory for better initial guesses
- Potential for implementing letter frequency analysis
- Could add word probability scoring for more efficient guessing

## Setup and Usage

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Compile TS to JS
```bash
npm run build
```
3. Ensure you have the word dictionary file (`eng_words.txt`) in the project root
4. Run the application:
```bash
npm start
```

## Dependencies

- Node.js
- Axios for API calls
- TypeScript
- File system access for dictionary loading

## Future Improvements

1. The generated Regex did not perfectly, [a-z] should become [b-z] when "a" is absent or present ( wrong position )
2. Add letter frequency analysis
3. Implement word commonality scoring
4. Add performance metrics tracking
5. Implement caching for frequently used patterns
