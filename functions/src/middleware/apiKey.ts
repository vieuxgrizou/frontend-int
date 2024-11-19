import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  apiKey?: string;
}

export const validateApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Exempter certaines routes du middleware de validation de clé API
    const exemptRoutes = ['/auth/login', '/auth/register', '/login', '/register'];
    if (exemptRoutes.some(route => req.path.includes(route))) {
      next();
      return;
    }

    const apiKey = req.headers['x-api-key'];

    // Vérification de la présence de la clé et de la longueur minimale
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 20) {
      res.status(401).json({
        error: 'Invalid API key format. API key is required in x-api-key header with a valid length.'
      });
      return;
    }

    // Validation du format selon le provider
    const provider = req.body?.provider || req.query?.provider;
    const apiKeyValidators: { [key: string]: (key: string) => boolean } = {
      openai: (key) => key.startsWith('sk-'),
      anthropic: (key) => key.startsWith('api-key-'),
    };

    if (provider && apiKeyValidators[provider] && !apiKeyValidators[provider](apiKey.trim())) {
      res.status(401).json({
        error: `Invalid ${provider} API key format.`
      });
      return;
    }

    // Stockage de la clé validée dans la requête pour utilisation ultérieure
    req.apiKey = apiKey.trim();
    next();
  } catch (error) {
    console.error('API key validation error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack available'
    });
    res.status(500).json({
      error: 'Failed to validate API key'
    });
  }
};
