export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    sites: number;
    commentsPerDay: number;
    personas: number;
    aiProviders: string[];
    customBranding: boolean;
    analytics: boolean;
    apiAccess: boolean;
    support: 'basic' | 'priority' | '24/7';
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
}

export interface BillingHistory {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'refunded';
  date: string;
  description: string;
  invoice?: string;
}