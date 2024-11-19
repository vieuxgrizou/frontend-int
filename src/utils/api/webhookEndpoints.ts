import type { WordPressSite, WebhookEvent } from '../types';
import { generateComment } from '../ai/commentGeneration';
import { validateWebhookSignature } from '../security/webhookSecurity';
import { axiosWithCache } from '../cache';

interface WebhookPayload {
  event: WebhookEvent;
  siteId: string;
  data: {
    postId?: string;
    postTitle?: string;
    postContent?: string;
    postUrl?: string;
    scheduledTime?: string;
    language?: string;
    personaCount?: number;
  };
  signature?: string;
}

interface WebhookResponse {
  success: boolean;
  message: string;
  scheduleId?: string;
  error?: string;
}

export async function handleWebhook(payload: WebhookPayload, secret: string): Promise<WebhookResponse> {
  try {
    // Vérifier la signature du webhook si fournie
    if (payload.signature && !validateWebhookSignature(JSON.stringify(payload), payload.signature, secret)) {
      throw new Error('Invalid webhook signature');
    }

    switch (payload.event) {
      case 'post.created':
      case 'post.updated':
        return handleNewPost(payload);
      case 'comment.schedule':
        return handleScheduledComment(payload);
      default:
        throw new Error(`Unsupported event: ${payload.event}`);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    };
  }
}

async function handleNewPost(payload: WebhookPayload): Promise<WebhookResponse> {
  const { siteId, data } = payload;
  const { postId, postTitle, postContent, language, personaCount = 1 } = data;

  if (!postId || !postTitle || !postContent) {
    throw new Error('Missing required post data');
  }

  try {
    // Récupérer les informations du site
    const site = await getSiteInfo(siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    // Vérifier si le site est configuré pour la génération automatique
    if (!site.autoGenerate) {
      return {
        success: false,
        message: 'Automatic comment generation is disabled for this site'
      };
    }

    // Planifier la génération de commentaires
    const schedule = await queueCommentGeneration({
      siteId,
      postId,
      commentCount: personaCount,
      language: language || site.commentSettings.language[0],
      context: {
        title: postTitle,
        content: postContent,
        url: data.postUrl
      },
      scheduledTime: data.scheduledTime || new Date().toISOString()
    });

    return {
      success: true,
      message: 'Comment generation scheduled',
      scheduleId: schedule.id
    };
  } catch (error) {
    throw new Error(`Failed to handle new post: ${error.message}`);
  }
}

async function handleScheduledComment(payload: WebhookPayload): Promise<WebhookResponse> {
  const { siteId, data } = payload;
  const { postId, scheduledTime } = data;

  if (!postId || !scheduledTime) {
    throw new Error('Missing required scheduling data');
  }

  try {
    const schedule = await scheduleCommentGeneration({
      siteId,
      postId,
      scheduledTime
    });

    return {
      success: true,
      message: 'Comment scheduled for generation',
      scheduleId: schedule.id
    };
  } catch (error) {
    throw new Error(`Failed to schedule comment: ${error.message}`);
  }
}

async function getSiteInfo(siteId: string): Promise<WordPressSite | null> {
  try {
    const response = await axiosWithCache.get(`/sites/${siteId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get site info:', error);
    return null;
  }
}

interface CommentGenerationTask {
  siteId: string;
  postId: string;
  commentCount: number;
  language: string;
  context: {
    title: string;
    content: string;
    url?: string;
  };
  scheduledTime: string;
}

async function queueCommentGeneration(task: CommentGenerationTask) {
  try {
    const response = await axiosWithCache.post('/tasks/comment-generation', task);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to queue comment generation: ${error.message}`);
  }
}

async function scheduleCommentGeneration(schedule: {
  siteId: string;
  postId: string;
  scheduledTime: string;
}) {
  try {
    const response = await axiosWithCache.post('/schedules/comments', schedule);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to schedule comment generation: ${error.message}`);
  }
}