import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { validateWordPressConnection } from '../utils/wordpress';

const router = Router();

// Route de test publique (pas besoin d'authentification)
router.post('/test-connection', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

// Routes protégées (requièrent l'authentification)
router.use(auth);

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // Vérification de l'authentification
    if (!req.user?.uid) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { url, applicationPassword } = req.body;

    // Validation des paramètres requis
    if (!url || !applicationPassword) {
      res.status(400).json({
        error: 'Missing required parameters: url, applicationPassword',
      });
      return;
    }

    // Nettoyage et validation de l'URL
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch {
      res.status(400).json({
        error: 'Invalid URL format',
      });
      return;
    }

    // Validation du mot de passe d'application
    if (!applicationPassword.includes(':')) {
      res.status(400).json({
        error: 'Invalid application password format. Expected format: username:password',
      });
      return;
    }

    // Test de la connexion WordPress
    const result = await validateWordPressConnection(cleanUrl, applicationPassword);

    res.json({
      success: result.success,
      url: cleanUrl,
      siteInfo: result.siteInfo,
    });
  } catch (error) {
    console.error('Site validation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to validate site',
    });
  }
});

router.get('/:id', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

router.patch('/:id', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

router.delete('/:id', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

export const sitesRouter = router;
