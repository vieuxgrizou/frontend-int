import React from 'react';
import { sitesApi } from '../utils/api/sites';
import { useAuth } from '../utils/auth/useAuth';
import toast from 'react-hot-toast';
import { MessageSquare, Shield, Globe2 } from 'lucide-react';

export default function ApiTester() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [authStatus, setAuthStatus] = React.useState<'authenticated' | 'unauthenticated'>('unauthenticated');

  React.useEffect(() => {
    setAuthStatus(user ? 'authenticated' : 'unauthenticated');
  }, [user]);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sitesApi.testConnection();
      setResponse(result);
      toast.success('Test de connexion API réussi !');
    } catch (err: any) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur inconnue';
      setError(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-card">
      <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary mb-4">
        Test de Connexion API
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              authStatus === 'authenticated'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
            }`}>
              <Shield className="h-4 w-4" />
              <span>
                {authStatus === 'authenticated' ? 'Authentifié' : 'Non authentifié'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-secondary">
              <Globe2 className="h-4 w-4" />
              <span>
                API: {import.meta.env.VITE_API_URL || 'https://api-g64uqov7ba-ew.a.run.app'}
              </span>
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isLoading || authStatus !== 'authenticated'}
            className="button-primary"
          >
            {isLoading ? (
              <>
                <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Tester la connexion
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
            <p className="text-sm text-red-700 dark:text-red-200">
              {error}
            </p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400">
            <p className="text-sm text-green-700 dark:text-green-200">
              Succès ! Réponse de l'API :
            </p>
            <pre className="mt-2 text-xs overflow-auto bg-white dark:bg-dark-paper p-4 rounded-lg">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}