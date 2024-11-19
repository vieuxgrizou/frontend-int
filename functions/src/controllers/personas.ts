import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Persona } from '../types';

// Middleware de validation utilisateur
const validateUser = (req: Request, res: Response): boolean => {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: 'Unauthorized. No user found in request.' });
    return false;
  }
  return true;
};

export const list = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const snapshot = await db.collection('personas')
      .where('userId', '==', req.user!.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const personas = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    res.json(personas);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const { name, gender, age, writingStyle, tone, languages, emoji, useHashtags, mentionOthers, includeMedia } = req.body;

    const persona = {
      userId: req.user!.uid,
      name,
      gender,
      age,
      writingStyle,
      tone,
      languages,
      emoji,
      useHashtags,
      mentionOthers,
      includeMedia,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('personas').add(persona);
    res.status(201).json({
      id: docRef.id,
      ...persona
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const bulkCreate = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const personas = req.body;

    const createdPersonas = [];
    for (const persona of personas) {
      const newPersona = {
        userId: req.user!.uid,
        ...persona,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await db.collection('personas').add(newPersona);
      createdPersonas.push({
        id: docRef.id,
        ...newPersona
      });
    }

    res.status(201).json(createdPersonas);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const get = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const personaRef = db.collection('personas').doc(req.params.id);
    const doc = await personaRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    const persona = doc.data() as Persona;
    res.json({
      ...persona,
      id: doc.id
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const personaRef = db.collection('personas').doc(req.params.id);
    const doc = await personaRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    const updatedPersona = {
      ...doc.data(),
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await personaRef.update(updatedPersona);
    res.json({ id: doc.id, ...updatedPersona });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!validateUser(req, res)) return;

    const personaRef = db.collection('personas').doc(req.params.id);
    const doc = await personaRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Persona not found' });
      return;
    }

    await personaRef.delete();
    res.json({ message: 'Persona deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
