// src/types/index.ts

// Type d'un site WordPress configuré
export interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  applicationPassword: string;
  aiProvider: string;
  aiModel: string;
  autoGenerate: boolean;
  commentSettings: {
    mode: 'auto' | 'manual';
    frequency: {
      commentsPerDay: number;   // Nombre de commentaires générés par jour
      minDelay: number;         // Délai minimum entre les commentaires en secondes
      maxDelay: number;         // Délai maximum entre les commentaires en secondes
    };
    schedule: {
      startTime: string;        // Format: HH:mm, par exemple '08:00'
      endTime: string;          // Format: HH:mm, par exemple '18:00'
      daysOfWeek: number[];     // Jours de la semaine, par exemple [1, 3, 5] pour lundi, mercredi, vendredi
    };
    language: string[];         // Langues dans lesquelles les commentaires peuvent être générés
    replyProbability: number;   // Probabilité de répondre à un commentaire, entre 0 et 1
    maxCommentsPerPost: number; // Nombre maximum de commentaires par publication
    autoCreatePersonas: boolean;
    personaCreationRate: number;
    aiSettings: {
      temperature: number;      // Niveau de créativité (0 à 1)
      maxTokens: number;        // Nombre maximum de tokens générés par OpenAI
      presencePenalty: number;  // Pénalité de présence (encourage la nouveauté)
      frequencyPenalty: number; // Pénalité de fréquence (décourage la répétition)
    };
  };
  assignedPersonas: string[];   // Liste des IDs de personas affectées au site
  userId: string;               // ID de l'utilisateur propriétaire
  createdAt: string;            // Date de création au format ISO
  updatedAt: string;            // Dernière date de mise à jour au format ISO
}

// Type pour une Persona utilisée dans les commentaires
export interface Persona {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  writingStyle: string;            // Style d'écriture de la persona
  writingStyleDescription: string; // Description du style d'écriture
  tone: string;                    // Ton employé par la persona
  toneDescription: string;         // Description du ton
  languages: string[];             // Langues parlées par la persona
  errorRate: number;               // Taux d'erreur dans l'écriture (pour simuler l'humanité)
  topics: string[];                // Sujets de prédilection de la persona
  emoji: boolean;                  // Utilisation d'emoji dans les commentaires
  useHashtags: boolean;            // Utilisation de hashtags dans les commentaires
  mentionOthers: boolean;          // Mentionner d'autres utilisateurs
  includeMedia: boolean;           // Inclure des médias dans les commentaires
  userId: string;                  // ID de l'utilisateur propriétaire de la persona
  createdAt: string;               // Date de création au format ISO
  updatedAt: string;               // Dernière date de mise à jour au format ISO
}

// Type pour un commentaire généré ou publié
export interface Comment {
  id: string;
  content: string;                 // Contenu du commentaire
  siteId: string;                  // ID du site WordPress sur lequel le commentaire est publié
  personaId: string;               // ID de la persona qui a généré le commentaire
  postId: number;                  // ID du post sur lequel le commentaire est publié (modifié de string à number)
  parentId?: number;               // ID du commentaire parent si c'est une réponse (modifié de string à number)
  status: 'pending' | 'approved' | 'rejected' | 'hold' | 'spam'; // Statut du commentaire
  userId: string;                  // ID de l'utilisateur propriétaire du commentaire
  createdAt: string;               // Date de création au format ISO
  publishedAt?: string;            // Date de publication au format ISO (si approuvé)
  rejectedAt?: string;             // Date de rejet au format ISO (si rejeté)
  wordpressId?: string;            // ID attribué par WordPress
  authorName?: string;             // Nom de l'auteur du commentaire
}
