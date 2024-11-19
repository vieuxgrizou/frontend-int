import { Request, Response, NextFunction } from 'express';

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required'
    });
  }

  // Vérifier la validité de l'API key
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key'
    });
  }

  next();
}

function isValidApiKey(apiKey: string): boolean {
  // Implémenter la validation de l'API key
  // Par exemple, vérifier dans la base de données
  return true;
}