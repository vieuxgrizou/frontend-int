import { db } from '../../config/firebase';

interface RateLimitResult {
  success: boolean;
  remainingPoints: number;
  nextAttempt: Date;
}

export async function rateLimit(
  identifier: string,
  action: string,
  options: { points: number; duration: number }
): Promise<RateLimitResult> {
  try {
    // Accéder au document Firestore
    const docRef = db.collection('rateLimits').doc(`${identifier}_${action}`);
    const doc = await docRef.get();
    let remainingPoints = options.points;
    const now = new Date();

    if (doc.exists) {
      const data = doc.data() as FirebaseFirestore.DocumentData;

      // Assurer que 'data.lastAttempt' est défini
      const lastAttempt = data.lastAttempt ? data.lastAttempt.toDate() : null;
      const timeDiff = lastAttempt
        ? (now.getTime() - lastAttempt.getTime()) / 1000
        : options.duration + 1; // Si 'lastAttempt' est null, forcer la réinitialisation

      if (timeDiff < options.duration) {
        const previousRemainingPoints = data.remainingPoints ?? options.points;
        remainingPoints = previousRemainingPoints - 1;

        if (remainingPoints <= 0) {
          // Limite atteinte
          return {
            success: false,
            remainingPoints: 0,
            nextAttempt: new Date(lastAttempt.getTime() + options.duration * 1000),
          };
        }
      } else {
        // Réinitialiser les points après la durée
        remainingPoints = options.points - 1;
      }
    } else {
      // Premier enregistrement pour cet identifiant/action
      remainingPoints = options.points - 1;
    }

    // Mettre à jour le document
    await docRef.set({
      remainingPoints,
      lastAttempt: now,
    });

    return {
      success: true,
      remainingPoints,
      nextAttempt: now,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la limitation de taux:', error.message);
    } else {
      console.error('Unknown error occurred during rate limiting:', error);
    }

    // En cas d'erreur, retourner un résultat indiquant l'échec
    return {
      success: false,
      remainingPoints: 0,
      nextAttempt: new Date(Date.now() + options.duration * 1000),
    };
  }
}
