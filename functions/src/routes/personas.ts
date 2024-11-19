import { Router, Request, Response, NextFunction } from 'express';
import * as personasController from '../controllers/personas';
import { auth } from '../middleware/auth';

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, next);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in authentication middleware:', error.message);
    } else {
      console.error('Unknown error occurred in authentication middleware:', error);
    }
    next(error);
  }
});

// Liste toutes les personas
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.list(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /:', error.message);
    } else {
      console.error('Unknown error occurred in /:', error);
    }
    next(error);
  }
});

// Crée une nouvelle persona
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.create(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /:', error.message);
    } else {
      console.error('Unknown error occurred in /:', error);
    }
    next(error);
  }
});

// Crée plusieurs personas en une requête
router.post('/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.bulkCreate(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /bulk:', error.message);
    } else {
      console.error('Unknown error occurred in /bulk:', error);
    }
    next(error);
  }
});

// Récupère une persona par ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.get(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /:id:', error.message);
    } else {
      console.error('Unknown error occurred in /:id:', error);
    }
    next(error);
  }
});

// Met à jour une persona (partiellement)
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.update(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /:id:', error.message);
    } else {
      console.error('Unknown error occurred in /:id:', error);
    }
    next(error);
  }
});

// Supprime une persona par ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await personasController.remove(req, res);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /:id:', error.message);
    } else {
      console.error('Unknown error occurred in /:id:', error);
    }
    next(error);
  }
});

export const personasRouter = router;
