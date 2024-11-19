import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Middleware de validation pour l'enregistrement d'un nouvel utilisateur
// Route pour l'enregistrement d'un nouvel utilisateur avec validation
router.post('/register', register);

// Route pour la connexion d'un utilisateur existant
router.post('/login', login);

export default router;
