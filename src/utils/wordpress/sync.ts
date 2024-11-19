import { wpApi } from './api';
import type { WordPressSite } from '../types';

// Synchronisation des articles
export async function syncPosts(site: WordPressSite) {
  try {
    // Récupérer tous les articles
    const posts = await wpApi.getPosts(site, { per_page: 100 });
    
    // Pour chaque article, récupérer les commentaires
    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        const comments = await wpApi.getComments(site, post.id);
        return {
          ...post,
          comments
        };
      })
    );

    return {
      success: true,
      posts: postsWithComments
    };
  } catch (error) {
    console.error('Failed to sync posts:', error);
    throw error;
  }
}

// Validation de la connexion
export async function validateConnection(site: WordPressSite) {
  try {
    // Tester l'authentification
    const client = wpApi.createWPClient(site);
    await client.get('/users/me');

    // Vérifier les permissions nécessaires
    const permissions = [
      'read',
      'create_posts',
      'edit_posts',
      'create_comments',
      'edit_comments',
      'moderate_comments'
    ];

    // TODO: Implémenter la vérification des permissions

    return {
      success: true,
      message: 'Connexion WordPress validée'
    };
  } catch (error) {
    console.error('Connection validation failed:', error);
    throw error;
  }
}

// Synchronisation des commentaires
export async function syncComments(site: WordPressSite, comments: any[]) {
  let syncedCount = 0;
  let failedCount = 0;
  let rateLimited = false;

  for (const comment of comments) {
    try {
      // Vérifier les limites de taux
      if (rateLimited) {
        console.log('Rate limit reached, pausing sync');
        break;
      }

      // Créer le commentaire
      await wpApi.createComment(site, {
        post: comment.postId,
        content: comment.content,
        author_name: comment.authorName,
        author_email: comment.authorEmail,
        parent: comment.parentId
      });

      syncedCount++;
      
      // Attendre entre chaque commentaire pour éviter les limites
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to sync comment:', error);
      
      if (error.response?.status === 429) {
        rateLimited = true;
      } else {
        failedCount++;
      }
    }
  }

  return {
    success: syncedCount > 0,
    syncedCount,
    failedCount,
    rateLimited
  };
}

// Webhook pour les commentaires
export async function handleCommentWebhook(site: WordPressSite, data: any) {
  const { action, comment } = data;

  switch (action) {
    case 'created':
      // Vérifier si une réponse est nécessaire
      if (site.commentSettings.replyProbability > Math.random()) {
        return scheduleCommentReply(site, comment);
      }
      break;

    case 'updated':
      // Mettre à jour le statut du commentaire
      break;

    case 'deleted':
      // Nettoyer les données associées
      break;
  }
}

async function scheduleCommentReply(site: WordPressSite, comment: any) {
  // Implémenter la logique de réponse automatique
  console.log('Scheduling reply for comment:', comment);
}