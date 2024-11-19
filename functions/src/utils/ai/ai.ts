import OpenAI from 'openai';
import axios from 'axios'; // Ajout d'Axios pour vérifier les erreurs spécifiques
import { WordPressSite, Persona } from '../../types';

interface CommentContext {
  postTitle: string;
  postContent: string;
  existingComments: string[];
  template?: { id: string; template: string };
  parentComment?: string;
  isReply?: boolean;
}

interface GeneratedComment {
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

// Fonction pour tester la clé API
export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const openai = new OpenAI({ apiKey });
    // Tente de lister les modèles pour vérifier la validité de la clé API
    await openai.models.list();
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Vérifier si l'erreur Axios a un code de statut correspondant
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false; // Clé API invalide
      }
    }

    // Gestion des erreurs inconnues
    if (error instanceof Error) {
      console.error('Erreur lors du test de la clé API:', error.message);
    } else {
      console.error('Unknown error occurred during API key test:', error);
    }

    throw new Error('An unknown error occurred while testing the API key');
  }
}

// Fonction pour générer un commentaire
export async function generateComment(
  site: WordPressSite,
  persona: Persona,
  context: CommentContext,
  apiKey: string
): Promise<GeneratedComment> {
  if (!apiKey?.trim()) {
    throw new Error('La clé API est requise');
  }

  const openai = new OpenAI({
    apiKey: apiKey.trim(),
  });

  try {
    const prompt = buildPrompt(persona, context);

    // Appel à l'API OpenAI pour générer un commentaire
    const response = await openai.chat.completions.create({
      model: site.aiModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: site.commentSettings.aiSettings.temperature,
      max_tokens: site.commentSettings.aiSettings.maxTokens,
      presence_penalty: site.commentSettings.aiSettings.presencePenalty,
      frequency_penalty: site.commentSettings.aiSettings.frequencyPenalty,
    });

    const content = response.choices[0]?.message?.content || '';

    // Vérification du contenu généré
    if (!content.trim()) {
      throw new Error('Le contenu du commentaire généré est vide');
    }

    return {
      content,
      metadata: {
        style: persona.writingStyle,
        tone: persona.tone,
        language: persona.languages[0],
        timestamp: new Date().toISOString(),
        isReply: context.isReply,
        templateId: context.template?.id,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Ne jamais retourner la clé API dans les messages d'erreur
      const safeError = error.message.replace(/(sk-\w{32,})/, '[FILTRÉ]');
      console.error('Erreur lors de la génération du commentaire:', safeError);
      throw new Error(`Erreur lors de la génération du commentaire: ${safeError}`);
    } else {
      console.error('Unknown error occurred while generating comment:', error);
      throw new Error('Une erreur inconnue est survenue lors de la génération du commentaire');
    }
  }
}

// Fonction pour construire le prompt
function buildPrompt(persona: Persona, context: CommentContext): string {
  let prompt = `En tant que ${persona.name}, une personne de ${persona.age} ans avec un style d'écriture ${
    persona.writingStyle.toLowerCase()
  } et un ton ${persona.tone.toLowerCase()}, `;

  if (context.isReply) {
    prompt += `répondez au commentaire suivant sur l'article "${context.postTitle}" :\n\n`;
    prompt += `Commentaire parent :\n${context.parentComment}\n`;
  } else {
    prompt += `écrivez un commentaire sur l'article "${context.postTitle}".\n`;
  }

  if (context.template) {
    prompt += `\nUtilisez ce modèle comme guide :\n${context.template.template}\n`;
  }

  prompt += `\nContenu de l'article :\n${context.postContent}\n\n`;

  prompt += `Instructions :
- Restez naturel et authentique
- Utilisez un langage approprié au style et au ton définis
- Faites référence au contenu de l'article
- Limitez-vous à 2-3 phrases
${persona.emoji ? '- Vous pouvez utiliser des emoji de manière naturelle' : ''}
${persona.useHashtags ? '- Vous pouvez utiliser des hashtags pertinents' : ''}`;

  return prompt;
}
