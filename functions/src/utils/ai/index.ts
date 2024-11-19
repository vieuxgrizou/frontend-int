import type { WordPressSite, Persona } from '../../types';

interface CommentContext {
  postTitle: string;
  postContent: string;
  existingComments?: string[];
  isReply?: boolean;
  parentComment?: string;
}

interface GeneratedComment {
  content: string;
  metadata: {
    style: string;
    tone: string;
    language: string;
  };
}

export async function generateComment(
  site: WordPressSite,
  persona: Persona,
  context: CommentContext
): Promise<GeneratedComment> {
  try {
    // Validation des entrées - Site et Persona
    if (!site || !persona) {
      throw new Error('Invalid site or persona data provided');
    }

    if (!site.name) {
      throw new Error('Site data is missing required field: name');
    }

    if (!persona.name || !persona.writingStyle || !persona.tone || !persona.languages?.length) {
      throw new Error('Incomplete persona data: name, writingStyle, tone, or languages are missing');
    }

    // Validation des entrées - Contexte
    if (!context || !context.postTitle || !context.postContent) {
      throw new Error('Invalid context data provided');
    }

    if (!context.postTitle.trim()) {
      throw new Error('Context data is missing required field: postTitle');
    }

    if (!context.postContent.trim()) {
      throw new Error('Context data is missing required field: postContent');
    }

    // Implémentation simplifiée pour générer un commentaire
    const content = `Generated comment for site "${site.name}" by persona "${persona.name}": "${context.postTitle}"`;
    const metadata = {
      style: persona.writingStyle,
      tone: persona.tone,
      language: persona.languages[0],
    };

    return {
      content,
      metadata,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la génération du commentaire:', error.message);
      throw new Error(`Erreur lors de la génération du commentaire: ${error.message}`);
    } else {
      console.error('Unknown error occurred while generating comment:', error);
      throw new Error('An unknown error occurred while generating the comment');
    }
  }
}
