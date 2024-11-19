import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, MessageSquare } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { sitesApi } from '../utils/api/sites';
import toast from 'react-hot-toast';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiResponse, setApiResponse] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const testApi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sitesApi.testConnection();
      setApiResponse(JSON.stringify(response, null, 2));
      toast.success('Test API réussi !');
    } catch (err: any) {
      console.error('Erreur API:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur inconnue';
      setError(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <header className="bg-white dark:bg-dark-paper border-b border-gray-200 dark:border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-dark-primary">Intensify</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => navigate('/auth')}
                className="button-secondary"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth?signup=true')}
                className="button-primary"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Test API Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-dark-paper shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Test de l'API</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={testApi}
                disabled={isLoading}
                className="button-primary"
              >
                {isLoading ? (
                  <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Test en cours...' : 'Tester la connexion à l\'API'}
              </button>
              <span className="text-sm text-gray-500 dark:text-dark-secondary">
                API: {import.meta.env.VITE_API_URL || 'https://api-g64uqov7ba-ew.a.run.app'}
              </span>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
                <p className="text-sm text-red-700 dark:text-red-200">
                  Erreur: {error}
                </p>
              </div>
            )}

            {apiResponse && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400">
                <p className="text-sm text-green-700 dark:text-green-200">
                  Succès ! Réponse de l'API :
                </p>
                <pre className="mt-2 text-xs overflow-auto bg-white dark:bg-dark-paper p-4 rounded-lg">
                  {apiResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <main>
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-dark-primary sm:text-5xl md:text-6xl">
                <span className="block">Automate your interactions</span>
                <span className="block text-primary-600">with a human touch</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-600 dark:text-dark-secondary sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Generate authentic and engaging WordPress comments using AI
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => navigate('/auth?signup=true')}
                    className="button-primary w-full md:w-auto"
                  >
                    Get started now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}