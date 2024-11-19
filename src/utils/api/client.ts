import axios from 'axios';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

// Utiliser l'URL de l'API de production
const BASE_URL = 'https://api-g64uqov7ba-ew.a.run.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter la clé API si disponible
    const apiKey = localStorage.getItem('openai_api_key');
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    return config;
  } catch (error) {
    console.error('Error adding auth token:', error);
    return Promise.reject(error);
  }
});

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error || error.message;

      console.error('API Error:', {
        status,
        message: errorMessage,
        url: error.config?.url
      });

      if (status === 401) {
        try {
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true);
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(error.config);
            }
          }
          window.location.href = '/auth';
          return Promise.reject(new Error('Session expirée'));
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await auth.signOut();
          window.location.href = '/auth';
          return Promise.reject(new Error('Session expirée'));
        }
      }

      if (status === 429) {
        toast.error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
        return Promise.reject(new Error('Rate limit exceeded'));
      }

      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    const message = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    toast.error(message);
    return Promise.reject(error);
  }
);