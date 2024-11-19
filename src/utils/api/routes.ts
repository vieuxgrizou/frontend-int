import { apiClient } from './client';
import type { WordPressSite, Persona, CommentTemplate } from '../types';

// Auth routes
export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  }
};

// Sites routes
export const sitesApi = {
  list: async () => {
    const response = await apiClient.get('/sites');
    return response.data;
  },

  create: async (site: Omit<WordPressSite, 'id'>) => {
    const response = await apiClient.post('/sites', site);
    return response.data;
  },

  update: async (id: string, site: Partial<WordPressSite>) => {
    const response = await apiClient.patch(`/sites/${id}`, site);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/sites/${id}`);
    return response.data;
  },

  validate: async (url: string, applicationPassword: string) => {
    const response = await apiClient.post('/sites/validate', {
      url,
      applicationPassword
    });
    return response.data;
  },

  testConnection: async () => {
    const response = await apiClient.post('/sites/test-connection');
    return response.data;
  }
};

// Comments routes
export const commentsApi = {
  generate: async (params: {
    siteId: string;
    postId: number;
    content: string;
    personaId: string;
  }) => {
    const response = await apiClient.post('/comments/generate', params);
    return response.data;
  },

  reply: async (params: {
    siteId: string;
    postId: number;
    content: string;
    personaId: string;
    parentId: number;
  }) => {
    const response = await apiClient.post(`/comments/${params.parentId}/reply`, params);
    return response.data;
  },

  approve: async (id: string) => {
    const response = await apiClient.patch(`/comments/${id}/approve`);
    return response.data;
  },

  reject: async (id: string) => {
    const response = await apiClient.patch(`/comments/${id}/reject`);
    return response.data;
  },

  listPending: async () => {
    const response = await apiClient.get('/comments/pending');
    return response.data;
  }
};

// Personas routes
export const personasApi = {
  list: async () => {
    const response = await apiClient.get('/personas');
    return response.data;
  },

  create: async (persona: Omit<Persona, 'id'>) => {
    const response = await apiClient.post('/personas', persona);
    return response.data;
  },

  update: async (id: string, persona: Partial<Persona>) => {
    const response = await apiClient.patch(`/personas/${id}`, persona);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/personas/${id}`);
    return response.data;
  }
};

// AI routes
export const aiApi = {
  testKey: async (provider: string) => {
    const response = await apiClient.post('/ai/test-key', { provider });
    return response.data;
  },

  generate: async (params: {
    provider: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    model?: string;
  }) => {
    const response = await apiClient.post('/ai/generate', params);
    return response.data;
  }
};