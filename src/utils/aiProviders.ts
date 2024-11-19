export const AI_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 et autres modèles avancés',
    apiEndpoint: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Dernière version de GPT-4',
        capabilities: ['text_generation', 'analysis'],
        maxTokens: 128000,
        temperatureRange: { min: 0, max: 2, default: 0.7 }
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude et ses variantes',
    apiEndpoint: 'https://api.anthropic.com/v1',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Modèle le plus avancé',
        capabilities: ['text_generation', 'analysis'],
        maxTokens: 200000,
        temperatureRange: { min: 0, max: 1, default: 0.7 }
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Gemini et PaLM',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Modèle multimodal avancé',
        capabilities: ['text_generation', 'analysis'],
        maxTokens: 150000,
        temperatureRange: { min: 0, max: 1, default: 0.7 }
      }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Modèles open-source optimisés',
    apiEndpoint: 'https://api.mistral.ai/v1',
    models: [
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        description: 'Modèle large le plus performant',
        capabilities: ['text_generation'],
        maxTokens: 32000,
        temperatureRange: { min: 0, max: 1, default: 0.7 }
      }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Modèles spécialisés pour le texte',
    apiEndpoint: 'https://api.cohere.ai/v1',
    models: [
      {
        id: 'command-r',
        name: 'Command-R',
        description: 'Optimisé pour la génération de texte',
        capabilities: ['text_generation'],
        maxTokens: 4000,
        temperatureRange: { min: 0, max: 2, default: 0.7 }
      }
    ]
  },
  {
    id: 'meta',
    name: 'Meta AI',
    description: 'LLaMA et autres modèles',
    apiEndpoint: 'https://api.meta.ai/v1',
    models: [
      {
        id: 'llama-3',
        name: 'LLaMA 3',
        description: 'Dernière version de LLaMA',
        capabilities: ['text_generation'],
        maxTokens: 100000,
        temperatureRange: { min: 0, max: 1, default: 0.7 }
      }
    ]
  }
];