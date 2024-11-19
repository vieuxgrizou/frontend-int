import { Router, Request, Response, NextFunction } from 'express';
import * as commentsController from '../controllers/comments';
import { auth } from '../middleware/auth';

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use((req: Request, res: Response, next: NextFunction) => {
  auth(req, res, next).catch((error) => {
    console.error('Error in authentication middleware:', error);
    next(error);
  });
});

// Routes pour les commentaires
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commentsController.generate(req, res);
  } catch (error) {
    next(handleError('Error in /generate', error));
  }
}); // Planification de commentaires

router.get('/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commentsController.listPending(req, res);
  } catch (error) {
    next(handleError('Error in /pending', error));
  }
}); // Liste des commentaires en attente

// Routes pour approuver ou rejeter un commentaire
router.patch('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commentsController.approve(req, res);
  } catch (error) {
    next(handleError('Error in /:id/approve', error));
  }
}); // Approuver un commentaire

router.patch('/:id/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commentsController.reject(req, res);
  } catch (error) {
    next(handleError('Error in /:id/reject', error));
  }
}); // Rejeter un commentaire

// Fonction de gestion des erreurs
function handleError(message: string, error: unknown): Error {
  if (error instanceof Error) {
    console.error(`${message}:`, error.message);
    return error;
  } else {
    console.error('Unknown error occurred:', error);
    return new Error('Unknown error occurred');
  }
}

// Exporter le routeur
export const commentsRouter = router;
