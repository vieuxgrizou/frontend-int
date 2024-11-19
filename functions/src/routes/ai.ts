// routes/ai.ts

import { Router, Request, Response, NextFunction } from 'express';
import * as aiController from './../controllers/ai';

const router = Router();

// Routes publiques - pas d'authentification requise
router.post('/test-key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await aiController.testKey(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /test-key:', error.message);
    } else {
      console.error('Unknown error occurred in /test-key:', error);
    }
    next(error);
  }
});

router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await aiController.generate(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /generate:', error.message);
    } else {
      console.error('Unknown error occurred in /generate:', error);
    }
    next(error);
  }
});

export { router as aiRouter };
