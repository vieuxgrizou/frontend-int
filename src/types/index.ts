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
      commentsPerDay: number;
      minDelay: number;
      maxDelay: number;
    };
    schedule: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
    language: string[];
    replyProbability: number;
    maxCommentsPerPost: number;
    autoCreatePersonas: boolean;
    personaCreationRate: number;
    aiSettings: {
      temperature: number;
      maxTokens: number;
      presencePenalty: number;
      frequencyPenalty: number;
    };
  };
  assignedPersonas: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Persona {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  writingStyle: string;
  writingStyleDescription: string;
  tone: string;
  toneDescription: string;
  languages: string[];
  errorRate: number;
  topics: string[];
  emoji: boolean;
  useHashtags: boolean;
  mentionOthers: boolean;
  includeMedia: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  siteId: string;
  personaId: string;
  postId: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  createdAt: string;
  publishedAt?: string;
  rejectedAt?: string;
  wordpressId?: string;
  metadata?: {
    style: string;
    tone: string;
    language: string;
    timestamp: string;
    isReply?: boolean;
    templateId?: string;
  };
}

export interface CommentTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  style: string;
  flexibility: number;
  contextRules: string[];
  variables: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
}