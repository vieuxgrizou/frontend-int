import React from 'react';
import { auth } from '../config/firebase';
import { useAuth } from '../utils/auth/useAuth';

export default function FirebaseStatus() {
  const { user, isLoading } = useAuth();
  const [firebaseInitialized, setFirebaseInitialized] = React.useState(false);

  React.useEffect(() => {
    // Vérifie si Firebase est initialisé
    if (auth) {
      setFirebaseInitialized(true);
    }
  }, []);

  if (!firebaseInitialized) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-dark-paper rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-900 dark:text-dark-primary mb-2">
        État Firebase
      </h3>
      <ul className="space-y-1 text-sm">
        <li className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${firebaseInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Firebase: {firebaseInitialized ? 'Initialisé' : 'Non initialisé'}</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : user ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Auth: {isLoading ? 'Chargement...' : user ? 'Connecté' : 'Déconnecté'}</span>
        </li>
        {user && (
          <li className="text-xs text-gray-500 dark:text-dark-secondary mt-2">
            Utilisateur: {user.email}
          </li>
        )}
      </ul>
    </div>
  );
}