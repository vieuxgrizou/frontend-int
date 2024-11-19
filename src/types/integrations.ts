export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  headers: Record<string, string>;
  enabled: boolean;
  secret?: string;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
  status: 'active' | 'failing' | 'disabled';
}

export type WebhookEvent = 
  | 'comment.created'
  | 'comment.updated'
  | 'comment.deleted'
  | 'persona.created'
  | 'persona.updated'
  | 'site.connected'
  | 'site.disconnected'
  | 'schedule.triggered';

export interface NotificationChannel {
  id: string;
  type: 'slack' | 'discord' | 'email';
  name: string;
  config: SlackConfig | DiscordConfig | EmailConfig;
  events: WebhookEvent[];
  enabled: boolean;
}

export interface SlackConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  icon?: string;
}

export interface DiscordConfig {
  webhookUrl: string;
  username?: string;
  avatar?: string;
}

export interface EmailConfig {
  recipients: string[];
  subject?: string;
  from?: string;
}

export interface Integration {
  id: string;
  type: 'zapier' | 'make' | 'n8n' | 'custom';
  name: string;
  description?: string;
  apiKey: string;
  config: Record<string, any>;
  enabled: boolean;
  status: 'active' | 'failing' | 'disabled';
  lastSync?: string;
}