import { Router } from 'express';
import { WordleController } from '../controllers/wordle.controller';
import { validateWordleInput } from '../middleware/validation.middleware';
import asyncHandler from 'express-async-handler';

const router = Router();
const wordleController = new WordleController();

router.get('/solve', validateWordleInput, asyncHandler(wordleController.solve));
router.get('/solve/all-sizes', asyncHandler(wordleController.solveAllSizes));
router.get('/solve/random', validateWordleInput, asyncHandler(wordleController.solveRandom));
router.get(
  '/solve/random/all',
  validateWordleInput,
  asyncHandler(wordleController.solveRandomAllSizesAndSeeds),
);

export default router;
