import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Brain } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../utils/auth/useAuth';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = React.useState(!searchParams.get('signup'));
  const { user, isLoading } = useAuth();

  // Redirect if already authenticated
  if (user && !isLoading) {
    return <Navigate to="/app" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Brain className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-dark-primary">
          {isLogin ? 'Connexion à votre compte' : 'Créer un compte'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-dark-secondary">
          {isLogin ? (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-paper py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}