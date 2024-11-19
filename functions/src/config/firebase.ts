import * as admin from 'firebase-admin';

try {
  // Vérifie si Firebase n'est pas déjà initialisé
  if (!admin.apps.length) {
    // Chargement des credentials Firebase
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), // Par défaut pour Firebase Cloud
    });

    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
  } else {
    console.error('Unknown error occurred during Firebase initialization:', error);
  }
  throw new Error('Firebase initialization failed');
}

// Exporte Firestore et Auth pour une utilisation facile
export const db = admin.firestore();
export const auth = admin.auth();
