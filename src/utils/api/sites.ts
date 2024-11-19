import { apiClient } from './client';
import type { WordPressSite } from '../types';

export const sitesApi = {
  // Test de connexion (endpoint public)
  testConnection: async () => {
    const response = await apiClient.post('/api/sites/test-connection');
    return response.data;
  },

  // Récupérer tous les sites
  list: async () => {
    const response = await apiClient.get('/api/sites');
    return response.data;
  },

  // Créer un nouveau site
  create: async (site: Omit<WordPressSite, 'id'>) => {
    const response = await apiClient.post('/api/sites', site);
    return response.data;
  },

  // Mettre à jour un site
  update: async (id: string, site: Partial<WordPressSite>) => {
    const response = await apiClient.patch(`/api/sites/${id}`, site);
    return response.data;
  },

  // Supprimer un site
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/sites/${id}`);
    return response.data;
  },

  // Valider les identifiants WordPress
  validateCredentials: async (url: string, applicationPassword: string) => {
    const response = await apiClient.post('/api/sites/validate', {
      url,
      applicationPassword
    });
    return response.data;
  }
};