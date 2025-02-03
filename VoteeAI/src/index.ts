import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import wordleRoutes from './routes/wordle.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express TypeScript API' });
});

// Wordle routes
app.use('/api/wordle', wordleRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 