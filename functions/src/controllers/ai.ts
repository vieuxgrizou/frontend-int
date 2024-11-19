// controllers/ai.ts

import { Request, Response } from 'express';
import { validateWordPressConnection } from '../utils/wordpress';
import { generateComment } from '../utils/ai';
import { rateLimit } from '../utils/rateLimiting/rateLimiting';
import { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken; // Utilisation du type correct pour le token décodé
  apiKey?: string;
}

export const testKey = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'];

    // Vérification de la présence de la clé
    if (!apiKey || typeof apiKey !== 'string') {
      res.status(401).json({
        error: 'API key is required in x-api-key header',
      });
      return;
    }

    // Validation du format selon le provider
    const provider = req.body?.provider || req.query?.provider;
    if (provider === 'openai') {
      if (!apiKey.trim().startsWith('sk-')) {
        res.status(401).json({
          error: 'Invalid OpenAI API key format. Must start with sk-',
        });
        return;
      }
    }

    // Stockage de la clé validée dans la requête pour utilisation ultérieure
    req.apiKey = apiKey.trim();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({
      error: 'Failed to validate API key',
    });
  }
};

export const generate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Vérification de l'authentification
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Validation des paramètres requis
    const { siteId, personaId, context } = req.body;
    if (!siteId || !personaId || !context) {
      res.status(400).json({
        error: 'Missing required parameters: siteId, personaId, context',
      });
      return;
    }

    // La clé API est déjà vérifiée et ajoutée à la requête par le middleware
    const apiKey = req.apiKey || '';

    // Rate limiting
    const rateLimitResult = await rateLimit(req.user.uid, 'ai-generation', {
      points: 50,
      duration: 3600, // 1 heure
    });

    if (!rateLimitResult.success) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        nextAttempt: rateLimitResult.nextAttempt,
      });
      return;
    }

    // Validation de la connexion WordPress
    const wordpressValidation = await validateWordPressConnection(siteId, apiKey);
    if (!wordpressValidation.success) {
      res.status(400).json({
        error: 'Failed to validate WordPress connection',
      });
      return;
    }

    // Génération du commentaire
    const comment = await generateComment(siteId, personaId, context);

    res.json(comment);
  } catch (error) {
    console.error('Comment generation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate comment',
    });
  }
};
