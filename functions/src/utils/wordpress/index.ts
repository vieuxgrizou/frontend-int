import axios from 'axios';
import { Comment, WordPressSite } from '../../types'; // Assumez que vous avez des types définis pour Comment et WordPressSite

export async function validateWordPressConnection(url: string, applicationPassword: string) {
  try {
    if (!url || !applicationPassword) {
      throw new Error('Missing WordPress URL or application password');
    }

    // Nettoyage du mot de passe (suppression des espaces)
    const cleanApplicationPassword = applicationPassword.replace(/\s+/g, '');

    // Vérification du format de l'URL
    if (!isValidURL(url)) {
      throw new Error('Invalid WordPress URL format');
    }

    // Test de connexion à l'API WordPress
    const response = await axios.get(`${url}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`admin:${cleanApplicationPassword}`).toString('base64')}`,
      },
    });

    return {
      success: true,
      siteInfo: {
        name: response.data.name || url,
        url: url,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la validation de la connexion WordPress:', error.message);
      throw new Error(`Erreur lors de la validation de la connexion WordPress: ${error.message}`);
    } else {
      console.error('Unknown error occurred during WordPress connection validation:', error);
      throw new Error('Une erreur inconnue est survenue lors de la validation de la connexion WordPress');
    }
  }
}

// Fonction pour valider le format de l'URL
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export async function publishMockComment(comment: Comment) {
  try {
    // Validation des données du commentaire
    if (!comment || !comment.content.trim()) {
      throw new Error('Invalid comment data: content is required');
    }

    if (!comment.authorName?.trim()) {
      throw new Error('Invalid comment data: author name is required');
    }

    if (comment.postId === undefined || isNaN(comment.postId)) {
      throw new Error('Invalid comment data: postId is required and must be a number');
    }

    // Mock : Implémentation simplifiée pour la publication du commentaire
    return {
      id: 'wp_' + Date.now(),
      status: 'published',
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la publication du commentaire:', error.message);
      throw new Error(`Erreur lors de la publication du commentaire: ${error.message}`);
    } else {
      console.error('Unknown error occurred during comment publishing:', error);
      throw new Error('Une erreur inconnue est survenue lors de la publication du commentaire');
    }
  }
}

export async function publishCommentToWordPress(
  site: WordPressSite,
  postId: number,
  content: string,
  authorName: string,
  parentId?: number
): Promise<{ id: number }> {
  try {
    // Nettoyage du mot de passe (suppression des espaces)
    const cleanApplicationPassword = site.applicationPassword.replace(/\s+/g, '');

    // Validation des entrées
    if (!site.url || !cleanApplicationPassword) {
      throw new Error('Invalid WordPress site configuration (missing URL or application password)');
    }
    if (!postId || !content || !authorName) {
      throw new Error('Missing required parameters: postId, content, or authorName');
    }

    // Appel à l'API WordPress pour publier un commentaire
    const response = await axios.post<{ id: number }>(
      `${site.url}/wp-json/wp/v2/comments`,
      {
        post: postId,
        content,
        author_name: authorName,
        status: 'publish',
        parent: parentId || 0, // Utilisation de 0 si parentId est undefined
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${site.username}:${cleanApplicationPassword}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Vérification de la présence d'un `id` dans la réponse
    if (!response.data || typeof response.data.id !== 'number') {
      throw new Error('Invalid response from WordPress: missing comment ID');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = (error.response?.data as { message: string })?.message || 'Unknown error from WordPress';
      console.error(`AxiosError: Failed to publish comment. Status Code: ${statusCode}. Message: ${message}`);
      throw new Error(`Failed to publish comment: ${message}`);
    }
    if (error instanceof Error) {
      console.error('Erreur lors de la publication du commentaire:', error.message);
      throw new Error(`Erreur lors de la publication du commentaire: ${error.message}`);
    } else {
      console.error('Unknown error occurred while publishing comment:', error);
      throw new Error('An unknown error occurred while publishing the comment');
    }
  }
}
