import axios from 'axios';
import type { WordPressSite } from '../types';

// Client API WordPress avec gestion de l'authentification
export function createWPClient(site: WordPressSite) {
  const client = axios.create({
    baseURL: `${site.url}/wp-json/wp/v2`,
    headers: {
      'Authorization': `Basic ${btoa(site.applicationPassword)}`,
      'Content-Type': 'application/json'
    }
  });

  // Intercepteur pour gérer les erreurs
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        throw new Error('Authentification WordPress invalide');
      }
      throw error;
    }
  );

  return client;
}

// Fonctions d'API WordPress
export const wpApi = {
  // Récupérer les articles récents
  async getPosts(site: WordPressSite, params = {}) {
    const client = createWPClient(site);
    const response = await client.get('/posts', {
      params: {
        per_page: 10,
        orderby: 'date',
        order: 'desc',
        ...params
      }
    });
    return response.data;
  },

  // Récupérer les commentaires d'un article
  async getComments(site: WordPressSite, postId: number, params = {}) {
    const client = createWPClient(site);
    const response = await client.get(`/comments`, {
      params: {
        post: postId,
        per_page: 100,
        ...params
      }
    });
    return response.data;
  },

  // Créer un commentaire
  async createComment(site: WordPressSite, data: {
    post: number;
    content: string;
    author_name: string;
    author_email: string;
    parent?: number;
  }) {
    const client = createWPClient(site);
    const response = await client.post('/comments', data);
    return response.data;
  },

  // Mettre à jour un commentaire
  async updateComment(site: WordPressSite, commentId: number, data: {
    content?: string;
    status?: 'approved' | 'hold' | 'spam' | 'trash';
  }) {
    const client = createWPClient(site);
    const response = await client.put(`/comments/${commentId}`, data);
    return response.data;
  },

  // Supprimer un commentaire
  async deleteComment(site: WordPressSite, commentId: number) {
    const client = createWPClient(site);
    const response = await client.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Récupérer les catégories
  async getCategories(site: WordPressSite) {
    const client = createWPClient(site);
    const response = await client.get('/categories');
    return response.data;
  },

  // Récupérer les tags
  async getTags(site: WordPressSite) {
    const client = createWPClient(site);
    const response = await client.get('/tags');
    return response.data;
  }
};

// Webhook pour les nouveaux articles
export async function handleNewPostWebhook(site: WordPressSite, data: any) {
  // Vérifier si l'article nécessite des commentaires
  const shouldGenerateComments = site.autoGenerate && 
    data.status === 'publish' &&
    !data.meta?.disable_auto_comments;

  if (shouldGenerateComments) {
    // Récupérer le contenu de l'article
    const post = await wpApi.getPosts(site, { include: [data.id] });
    
    // Analyser le contenu pour la génération de commentaires
    const context = {
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      categories: post.categories,
      tags: post.tags
    };

    // Planifier la génération de commentaires
    return scheduleCommentGeneration(site, {
      postId: data.id,
      context,
      count: site.commentSettings.frequency.commentsPerDay
    });
  }
}

// Planification des commentaires
interface CommentSchedule {
  postId: number;
  context: any;
  count: number;
}

async function scheduleCommentGeneration(site: WordPressSite, schedule: CommentSchedule) {
  // Implémenter la logique de planification
  console.log('Scheduling comments for:', schedule);
}