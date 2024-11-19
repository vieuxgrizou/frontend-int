import { apiClient } from '../api/client';
import type { WordPressSite } from '../types';

interface ValidationResult {
  success: boolean;
  error?: string;
  siteInfo?: {
    name: string;
    description: string;
    url: string;
    version: string;
  };
  permissions?: {
    missing: string[];
    available: string[];
  };
}

export async function validateWordPressConnection(
  url: string,
  applicationPassword: string
): Promise<ValidationResult> {
  try {
    // Normaliser l'URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Valider le format de l'URL
    try {
      new URL(url);
    } catch {
      throw new Error('URL invalide');
    }

    // Valider le mot de passe d'application
    if (!applicationPassword.trim()) {
      throw new Error('Le mot de passe d\'application est requis');
    }

    // Appel à l'API pour la validation
    const response = await apiClient.post<ValidationResult>('/api/sites/validate', {
      url,
      applicationPassword
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Identifiants WordPress invalides'
      };
    }

    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'Site WordPress introuvable'
      };
    }

    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Erreur de connexion à WordPress'
    };
  }
}