import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

// Utiliser la déclaration de module pour étendre l'interface Request
declare module 'express-serve-static-core' {
  interface Request {
    /**
     * Utilisateur authentifié via Firebase.
     * La propriété `user` sera définie après une vérification réussie du token par `auth`.
     */
    user?: DecodedIdToken; // Type correspondant au token décodé par verifyIdToken

    /**
     * Clé API fournie par l'utilisateur ou requête.
     * La propriété `apiKey` est définie par un middleware de validation.
     */
    apiKey?: string;
  }
}
