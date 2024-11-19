import type { Comment } from '../types';
import { aiApi } from '../api/routes';
import { useOpenAI } from '../hooks/useOpenAI';

export interface CommentContext {
  postTitle: string;
  postContent: string;
  existingComments: string[];
  template?: {
    id: string;
    template: string;
  };
  parentComment?: string;
  isReply?: boolean;
}

export interface GeneratedComment {
  content: string;
  metadata: {
    style: string;
    tone: string;
    language: string;
    timestamp: string;
    isReply?: boolean;
    templateId?: string;
  };
}

export async function generateComment(
  siteId: string,
  personaId: string,
  context: CommentContext
): Promise<Comment> {
  const { apiKey, isLoading, error, isConfigured } = useOpenAI();

  if (isLoading) {
    throw new Error('Loading OpenAI configuration...');
  }

  if (error || !isConfigured) {
    throw new Error('OpenAI API key not properly configured');
  }

  try {
    const response = await aiApi.generate({
      siteId,
      personaId,
      context,
      apiKey
    });

    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error generating comment');
  }
}