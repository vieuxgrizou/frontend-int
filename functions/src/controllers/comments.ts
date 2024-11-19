import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { WordPressSite, Comment, Persona } from '../types';
import { generateComment } from '../utils/ai';
import { publishCommentToWordPress } from '../utils/wordpress/index';
import { replyToComment } from '../utils/wordpress/wordpress';
import { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

// Middleware de validation utilisateur
const validateUser = (req: AuthenticatedRequest, res: Response): boolean => {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: 'Unauthorized. No user found in request.' });
    return false;
  }
  return true;
};

// Fonction pour vérifier et récupérer un document Firebase
const getDocument = async (collection: string, id: string, userId: string, res: Response) => {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists || doc.data()?.userId !== userId) {
      res.status(403).json({ error: `Unauthorized access to ${collection}` });
      return null;
    }
    return doc.data();
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve document.' });
    return null;
  }
};

// Fonction pour générer un commentaire
export const generate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const { siteId, personaId, context } = req.body;

    // Vérifier l'accès au site et au persona
    const siteData = await getDocument('sites', siteId, req.user!.uid, res);
    const personaData = await getDocument('personas', personaId, req.user!.uid, res);
    if (!siteData || !personaData) return;

    const site = { id: siteId, ...siteData } as WordPressSite;
    const persona = { id: personaId, ...personaData } as Persona;

    // Générer le commentaire
    const comment = await generateComment(site, persona, context);

    // Sauvegarder dans Firestore
    const commentRef = await db.collection('comments').add({
      content: comment.content,
      metadata: comment.metadata,
      siteId,
      personaId,
      userId: req.user!.uid,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.json({
      id: commentRef.id,
      content: comment.content,
      metadata: comment.metadata
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Fonction pour approuver un commentaire
export const approve = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateUser(req, res)) return;
    const commentRef = db.collection('comments').doc(req.params.id);
    const doc = await commentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = doc.data() as Comment;

    if (comment.userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized access to comment' });
    }

    if (!comment.postId) {
      return res.status(400).json({ error: 'postId is required to publish the comment' });
    }

    const postId = comment.postId;
    const content = comment.content || '';
    const authorName = comment.authorName || 'Anonymous';
    const parentId = comment.parentId ?? 0;

    const siteData = await getDocument('sites', comment.siteId, req.user!.uid, res);
    if (!siteData) return;

    const site = { id: comment.siteId, ...siteData } as WordPressSite;

    // Publier le commentaire sur WordPress
    const wordpressResponse = await publishCommentToWordPress(site, postId, content, authorName, parentId);

    if (!wordpressResponse || typeof wordpressResponse !== 'object' || typeof wordpressResponse.id !== 'number') {
      throw new Error('Failed to publish comment to WordPress');
    }

    await commentRef.update({
      status: 'approved',
      publishedAt: new Date().toISOString(),
      wordpressId: wordpressResponse.id.toString()
    });

    res.json({
      ...comment,
      status: 'approved',
      publishedAt: new Date().toISOString(),
      wordpressId: wordpressResponse.id.toString()
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
    }
    return;
};

// Fonction pour rejeter un commentaire
export const reject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const commentRef = db.collection('comments').doc(req.params.id);
    const doc = await commentRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (doc.data()?.userId !== req.user!.uid) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await commentRef.update({
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });

    res.json({
      id: doc.id,
      ...doc.data(),
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Liste des commentaires en attente
export const listPending = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const snapshot = await db.collection('comments')
      .where('userId', '==', req.user!.uid)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(comments);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Fonction pour répondre à un commentaire
export const reply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const { siteId, content, authorName } = req.body;
    const { id: parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({ error: 'Missing required parameter: parentId' });
    }

    // Vérifier l'accès au site
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists || siteDoc.data()?.userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized access to the site.' });
    }

    const site = { id: siteId, ...siteDoc.data() } as WordPressSite;

    // Publier la réponse au commentaire sur WordPress
    const wordpressResponse = await replyToComment(site, parseInt(parentId), content, authorName, parseInt(parentId));

    if (!wordpressResponse || typeof wordpressResponse !== 'object' || typeof wordpressResponse.id !== 'number') {
      throw new Error('Failed to publish reply to WordPress');
    }

    res.json({
      status: 'replied',
      wordpressId: wordpressResponse.id.toString(),
      parentId,
      content,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
  return;
};
