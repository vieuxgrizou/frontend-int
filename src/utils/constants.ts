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
  }
];

export const WRITING_STYLES = [
  {
    name: 'Informel',
    description: 'Style décontracté et naturel'
  },
  {
    name: 'Professionnel',
    description: 'Style formel et business'
  },
  {
    name: 'Académique',
    description: 'Style scientifique et rigoureux'
  },
  {
    name: 'Créatif',
    description: 'Style original et expressif'
  }
];

export const TONES = [
  {
    name: 'Amical',
    description: 'Ton chaleureux et sympathique'
  },
  {
    name: 'Neutre',
    description: 'Ton objectif et impartial'
  },
  {
    name: 'Enthousiaste',
    description: 'Ton dynamique et positif'
  },
  {
    name: 'Critique',
    description: 'Ton analytique et constructif'
  }
];

export const COMMENT_STYLES = {
  CREATIVE: {
    name: 'Créatif',
    description: 'Style libre et expressif',
    flexibility: 0.8
  },
  STRUCTURED: {
    name: 'Structuré',
    description: 'Style organisé et méthodique',
    flexibility: 0.4
  },
  BALANCED: {
    name: 'Équilibré',
    description: 'Style mixte et adaptable',
    flexibility: 0.6
  }
};