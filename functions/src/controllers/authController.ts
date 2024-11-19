import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';

// Fonction pour l'enregistrement d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, mot de passe, et nom sont requis.' });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({ error: 'Email invalide.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
    return;
  }

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });
    res.status(201).json({ message: 'Utilisateur enregistré avec succès', userId: userRecord.uid });
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'Cet email est déjà enregistré.' });
    } else {
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
    }
  }
};

// Fonction pour la connexion d'un utilisateur existant
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe sont requis.' });
    return;
  }

  try {
    // Firebase ne gère pas directement la connexion, donc vous devrez utiliser l'authentification côté client
    res.status(200).json({
      message: 'Veuillez utiliser le SDK Firebase côté client pour vous connecter. Utilisez "signInWithEmailAndPassword" pour vous authentifier.'
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
};
