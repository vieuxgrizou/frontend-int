import express from 'express';
import { handleWebhook } from './webhookEndpoints';
import { validateApiKey } from '../security/apiSecurity';

const router = express.Router();

// Middleware de validation de l'API key
router.use(validateApiKey);

// Route principale pour les webhooks
router.post('/webhook', async (req, res) => {
  try {
    const result = await handleWebhook(req.body, process.env.WEBHOOK_SECRET!);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Documentation des webhooks
router.get('/webhook/docs', (req, res) => {
  res.json({
    version: '1.0',
    endpoints: {
      '/webhook': {
        methods: ['POST'],
        events: [
          {
            name: 'post.created',
            description: 'Déclenché quand un nouvel article est publié',
            required_fields: ['postId', 'postTitle', 'postContent'],
            optional_fields: ['postUrl', 'language', 'personaCount']
          },
          {
            name: 'post.updated',
            description: 'Déclenché quand un article est mis à jour',
            required_fields: ['postId', 'postTitle', 'postContent'],
            optional_fields: ['postUrl', 'language', 'personaCount']
          },
          {
            name: 'comment.schedule',
            description: 'Planifier la génération de commentaires',
            required_fields: ['postId', 'scheduledTime'],
            optional_fields: ['language', 'personaCount']
          }
        ],
        authentication: {
          type: 'Bearer token',
          header: 'Authorization'
        },
        security: {
          signature: {
            type: 'HMAC-SHA256',
            header: 'X-Webhook-Signature'
          }
        }
      }
    },
    examples: {
      'post.created': {
        payload: {
          event: 'post.created',
          siteId: 'site_123',
          data: {
            postId: 'post_123',
            postTitle: 'Mon nouvel article',
            postContent: 'Contenu de l\'article...',
            postUrl: 'https://example.com/article',
            language: 'fr',
            personaCount: 3
          }
        }
      }
    }
  });
});

export default router;