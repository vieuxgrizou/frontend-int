import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../utils/auth/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour du profil
    console.log('Mise à jour du profil:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="container-card">
        <div className="px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-primary">
                    {formData.name}
                  </h1>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-dark-secondary">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-dark-secondary" />
                    <span>{formData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-card">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
              Informations personnelles
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Gérez vos informations personnelles et vos préférences de compte.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Nom complet
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-standard flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg"
                    />
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Email
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-standard flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="button-primary"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-card">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
              Sécurité
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Gérez vos paramètres de sécurité et l'authentification.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-4">
              <button
                type="button"
                className="button-secondary"
              >
                <Shield className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}