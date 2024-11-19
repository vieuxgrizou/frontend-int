import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { validateWordPressConnection } from '../utils/wordpress';

const sitesRef = db.collection('sites');

// Middleware de validation utilisateur
const validateUser = (req: Request, res: Response): boolean => {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: 'Unauthorized. No user found in request.' });
    return false;
  }
  return true;
};

// Liste tous les sites pour l'utilisateur
export const list = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const snapshot = await sitesRef.where('userId', '==', req.user!.uid).get();
    const sites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(sites);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Crée un nouveau site
export const create = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const { url, username, applicationPassword } = req.body;

    // Validation des champs requis
    if (!url || !username || !applicationPassword) {
      res.status(400).json({ error: 'Missing required fields: url, username, applicationPassword' });
      return;
    }

    // Validation de la connexion WordPress
    const validationResult = await validateWordPressConnection(url, applicationPassword);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid WordPress credentials' });
      return;
    }

    const site = {
      userId: req.user!.uid,
      url,
      username,
      applicationPassword,
      createdAt: new Date().toISOString(),
      siteInfo: validationResult.siteInfo,
    };

    const docRef = await sitesRef.add(site);
    res.status(201).json({ id: docRef.id, ...site });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Récupère un site par ID
export const get = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const siteId = req.params.id;
    const siteDoc = await sitesRef.doc(siteId).get();

    if (!siteDoc.exists) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }

    res.json({ id: siteDoc.id, ...siteDoc.data() });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Met à jour un site partiellement
export const update = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const siteId = req.params.id;
    const updates = req.body;

    const siteDoc = await sitesRef.doc(siteId).get();
    if (!siteDoc.exists) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }

    await sitesRef.doc(siteId).update(updates);
    res.json({ success: true, message: 'Site updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Supprime un site par ID
export const remove = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const siteId = req.params.id;
    const siteDoc = await sitesRef.doc(siteId).get();

    if (!siteDoc.exists) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }

    await sitesRef.doc(siteId).delete();
    res.json({ success: true, message: 'Site deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
