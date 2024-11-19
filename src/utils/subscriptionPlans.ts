export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Parfait pour démarrer',
    price: 9.99,
    billingPeriod: 'monthly',
    features: [
      'Jusqu\'à 3 sites WordPress',
      '100 commentaires par jour',
      '5 personas',
      'Support par email'
    ],
    limits: {
      sites: 3,
      commentsPerDay: 100,
      personas: 5,
      aiProviders: ['openai'],
      customBranding: false,
      analytics: false,
      apiAccess: false,
      support: 'basic'
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les professionnels',
    price: 29.99,
    billingPeriod: 'monthly',
    features: [
      'Jusqu\'à 10 sites WordPress',
      '500 commentaires par jour',
      '20 personas',
      'Analytics avancés',
      'Support prioritaire'
    ],
    limits: {
      sites: 10,
      commentsPerDay: 500,
      personas: 20,
      aiProviders: ['openai', 'anthropic', 'google'],
      customBranding: true,
      analytics: true,
      apiAccess: false,
      support: 'priority'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solution complète pour les entreprises',
    price: 99.99,
    billingPeriod: 'monthly',
    features: [
      'Sites WordPress illimités',
      'Commentaires illimités',
      'Personas illimités',
      'Tous les fournisseurs d\'IA',
      'API Access',
      'Support 24/7'
    ],
    limits: {
      sites: -1,
      commentsPerDay: -1,
      personas: -1,
      aiProviders: ['openai', 'anthropic', 'google', 'mistral', 'cohere', 'meta'],
      customBranding: true,
      analytics: true,
      apiAccess: true,
      support: '24/7'
    }
  }
];