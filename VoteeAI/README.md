# Wordle Solver Service

A TypeScript-based service that solves Wordle puzzles of various sizes.

## Credits

- English Dictionary: [dwyl/english-words](https://github.com/dwyl/english-words) - Comprehensive English word list used for dictionary matching

## Features

- Solves Wordle puzzles of sizes 5-18
- Supports both daily and random word puzzles
- Input validation using Zod
- Comprehensive error handling
- Logging system with Winston
- Code quality tools (ESLint, Prettier)
- Git hooks with Husky
- TypeScript strict mode

## Project Structure

```
.
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── const/          # Constants and configurations
├── logs/              # Application logs
├── dist/              # Compiled JavaScript
├── node_modules/      # Dependencies
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jest.config.js    # Jest configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project metadata and dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Error Handling

The application uses a centralized error handling system with custom `AppError` class. All operational errors are properly logged and returned to the client with appropriate HTTP status codes.

## Logging

Logging is implemented using Winston with the following features:
- Console logging in development
- File-based logging in production
- Error logs in `logs/error.log`
- Combined logs in `logs/combined.log`
- JSON format for better parsing
- Timestamp and error stack traces

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- Pre-commit hooks for linting and formatting

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

MIT
