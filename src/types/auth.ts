export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  darkMode: boolean;
  subscription: UserSubscription;
}

export interface UserSubscription {
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}