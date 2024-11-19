import type { WordPressSite, Persona, CommentTemplate } from '../types';
import { generateComment } from './commentGeneration';

interface CommentGenerationConfig {
  site: WordPressSite;
  personas: Persona[];
  templates: CommentTemplate[];
  context: {
    postId: string;
    postTitle: string;
    postContent: string;
    existingComments: string[];
  };
}

export class CommentService {
  private selectRandomPersona(personas: Persona[], languages: string[]): Persona | null {
    // Filtrer les personas qui peuvent commenter dans les langues requises
    const eligiblePersonas = personas.filter(persona => 
      languages.every(lang => persona.languages.includes(lang))
    );

    if (eligiblePersonas.length === 0) return null;
    return eligiblePersonas[Math.floor(Math.random() * eligiblePersonas.length)];
  }

  private selectTemplate(templates: CommentTemplate[], persona: Persona): CommentTemplate | null {
    // Filtrer les templates compatibles avec le style du persona
    const compatibleTemplates = templates.filter(template => 
      template.style === persona.writingStyle
    );

    if (compatibleTemplates.length === 0) return null;
    return compatibleTemplates[Math.floor(Math.random() * compatibleTemplates.length)];
  }

  private async generateCommentWithRetry(
    site: WordPressSite,
    persona: Persona,
    context: CommentGenerationConfig['context'],
    template?: CommentTemplate,
    maxRetries = 3
  ) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await generateComment(site, persona, {
          ...context,
          template
        });
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }

    throw lastError;
  }

  public async generateComments(config: CommentGenerationConfig) {
    const { site, personas, templates, context } = config;
    const results = {
      success: [] as any[],
      failed: [] as any[]
    };

    // Déterminer le nombre de commentaires à générer
    const commentsToGenerate = Math.min(
      site.commentSettings.maxCommentsPerPost,
      site.commentSettings.frequency.commentsPerDay
    );

    for (let i = 0; i < commentsToGenerate; i++) {
      try {
        // 1. Sélectionner un persona
        const persona = this.selectRandomPersona(
          site.assignedPersonas.length > 0
            ? personas.filter(p => site.assignedPersonas.includes(p.id))
            : personas,
          site.commentSettings.language
        );

        if (!persona) {
          throw new Error('Aucun persona compatible disponible');
        }

        // 2. Sélectionner un template si disponible
        const template = this.selectTemplate(templates, persona);

        // 3. Générer le commentaire
        const comment = await this.generateCommentWithRetry(
          site,
          persona,
          context,
          template
        );

        results.success.push({
          comment,
          persona: persona.id,
          template: template?.id
        });

        // 4. Ajouter un délai aléatoire entre les générations
        const delay = Math.random() * 
          (site.commentSettings.frequency.maxDelay - site.commentSettings.frequency.minDelay) + 
          site.commentSettings.frequency.minDelay;
        
        await new Promise(resolve => setTimeout(resolve, delay * 1000));

      } catch (error) {
        results.failed.push({
          error: error.message,
          attempt: i + 1
        });
      }
    }

    return results;
  }

  public async generateReply(
    config: CommentGenerationConfig,
    parentCommentId: string,
    parentCommentContent: string
  ) {
    // Vérifier si on doit répondre selon la probabilité configurée
    if (Math.random() > config.site.commentSettings.replyProbability) {
      return null;
    }

    try {
      // Sélectionner un persona différent pour la réponse
      const persona = this.selectRandomPersona(
        config.personas.filter(p => config.site.assignedPersonas.includes(p.id)),
        config.site.commentSettings.language
      );

      if (!persona) {
        throw new Error('Aucun persona disponible pour la réponse');
      }

      // Enrichir le contexte avec le commentaire parent
      const enrichedContext = {
        ...config.context,
        parentComment: parentCommentContent,
        isReply: true
      };

      // Générer la réponse
      const reply = await this.generateCommentWithRetry(
        config.site,
        persona,
        enrichedContext
      );

      return {
        reply,
        persona: persona.id
      };

    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      return null;
    }
  }
}

// Export une instance unique du service
export const commentService = new CommentService();