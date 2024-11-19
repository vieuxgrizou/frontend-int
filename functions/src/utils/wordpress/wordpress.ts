import axios from 'axios';
import { WordPressSite } from '../../types';  // Assumez que WordPressSite est bien défini

interface WordPressComment {
  id: number;
  post: number;
  content: {
    rendered: string;
    raw: string;
  };
  author_name: string;
  author_email?: string; // Peut être facultatif selon les configurations
  status: string;
  parent: number;
}

// Fonction pour répondre à un commentaire existant sur WordPress
export async function replyToComment(
  site: WordPressSite,
  postId: number,
  content: string,
  authorName: string,
  parentId: number // Ici, parentId doit être fourni pour répondre à un commentaire
): Promise<WordPressComment> {
  const cleanApplicationPassword = site.applicationPassword.replace(/\s+/g, '');

  // Validation des entrées
  if (!site.url || !cleanApplicationPassword) {
    throw new Error('Invalid WordPress site configuration (missing URL or application password)');
  }
  if (!postId || !content || !authorName) {
    throw new Error('Missing required parameters: postId, content, or authorName');
  }

  try {
    // Appel à l'API WordPress pour répondre à un commentaire
    const response = await axios.post<WordPressComment>(
      `${site.url}/wp-json/wp/v2/comments`,
      {
        post: postId,
        content,
        author_name: authorName,
        status: 'publish',
        parent: parentId, // Utilisation de parentId pour indiquer que c'est une réponse
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${site.username}:${cleanApplicationPassword}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || typeof response.data.id !== 'number') {
      throw new Error('Invalid response from WordPress: missing comment ID');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = (error.response?.data as { message: string })?.message || 'Unknown error from WordPress';
      console.error(`AxiosError: Failed to reply to comment. Status Code: ${statusCode}. Message: ${message}`);
      throw new Error(`Failed to reply to comment: ${message}`);
    }

    if (error instanceof Error) {
      console.error('Erreur lors de la réponse au commentaire:', error.message);
      throw new Error(`Erreur lors de la réponse au commentaire: ${error.message}`);
    } else {
      console.error('Unknown error occurred while replying to comment:', error);
      throw new Error('An unknown error occurred while replying to the comment');
    }
  }
}
