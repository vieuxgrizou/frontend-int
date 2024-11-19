import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth as firebaseAuth } from '../config/firebase';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Exempter certaines routes du middleware d'authentification
    const exemptRoutes = ['/auth/login', '/auth/register', '/login', '/register'];
    if (exemptRoutes.some(route => req.path.includes(route))) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;

    // Vérifiez que l'en-tête Authorization est présent et correctement formé
    if (!authHeader || typeof authHeader !== 'string') {
      res.status(401).json({ error: 'Authorization header missing or malformed. L\'en-tête doit commencer par "Bearer" suivi du token.' });
      return;
    }

    // Vérification de la structure de l'en-tête Authorization avec une expression régulière
    const bearerRegex = /^Bearer\s+(\S+)$/;
    const matches = bearerRegex.exec(authHeader);
    if (!matches) {
      res.status(401).json({ error: 'Invalid authorization header format. Assurez-vous que l\'en-tête contient "Bearer" suivi du token.' });
      return;
    }

    const token = matches[1].trim();
    if (!token || token.length < 20) {
      res.status(401).json({ error: 'Token missing or invalid format. Assurez-vous que le token est présent et correctement formé après "Bearer".' });
      return;
    }

    // Vérification du token via Firebase
    const decodedToken: DecodedIdToken = await firebaseAuth.verifyIdToken(token);
    if (!decodedToken) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = decodedToken; // Associer le token décodé à req.user
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Auth error:', error.message, error.stack);

      // Gestion des erreurs spécifiques
      if ((error as any).code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Token expired' });
        return;
      }

      res.status(401).json({ error: 'Invalid token' });
    } else {
      console.error('Auth error:', 'An unknown error occurred during authentication.');
      res.status(401).json({ error: 'An unknown error occurred during authentication. Please try again later.' });
    }
  }
};
