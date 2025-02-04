import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import wordleRoutes from './routes/wordle.routes';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';
import { AppError } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors()); // Enable CORS for all routes
app.use(compression()); // Compress responses

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Basic health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env,
  });
});

// Welcome route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Wordle Solver API',
    version: '1.0.0',
    documentation: '/api-docs', // For future Swagger/OpenAPI documentation
  });
});

// API routes
app.use('/api/wordle', wordleRoutes);

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'Route not found'));
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Performing graceful shutdown...');
  // Close server and database connections here if any
  process.exit(0);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start server
app.listen(port, () => {
  logger.info(`🚀 Server started in ${env} mode on port ${port}`);
  logger.info(`Health check available at http://localhost:${port}/health`);
});
