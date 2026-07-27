export type SubscriptionTier = 'free' | 'pro' | 'lifetime';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  features: string[];
  limits: PlanLimits;
}

export interface PlanLimits {
  dailyMcqs: number;
  aiTokensPerDay: number;
  mockTests: number;
  analyticsDepth: 'basic' | 'advanced' | 'full';
  tutorAccess: boolean;
}

export interface TokenPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  currency: string;
  originalPrice?: number;
  badge?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'jazzcash' | 'easypaisa' | 'stripe' | 'card';
  name: string;
  icon: string;
}

export interface PaymentPayload {
  tier?: SubscriptionTier;
  tokenPackId?: string;
  paymentMethod: PaymentMethod['type'];
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  redirectUrl?: string;
}
