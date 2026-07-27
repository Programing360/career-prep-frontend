import { useState } from 'react';
import {
  Crown,
  Zap,
  Check,
  X,
  CreditCard,
  Smartphone,
  Shield,
  Sparkles,
  XIcon,
  ArrowRight,
  Gift,
  InfinityIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type {
  SubscriptionTier,
  TokenPack,
  PaymentMethod,
} from '@/types/premium';

const tiers: {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice?: number;
  icon: typeof Crown;
  color: string;
  borderColor: string;
  badge?: string;
  features: { text: string; included: boolean }[];
}[] = [
  {
    tier: 'free',
    name: 'Free',
    monthlyPrice: null,
    icon: Zap,
    color: 'text-secondary-600 dark:text-secondary-400',
    borderColor: 'border-secondary-200 dark:border-secondary-700',
    features: [
      { text: '50 MCQs per day', included: true },
      { text: '5 AI tokens per day', included: true },
      { text: '1 mock test per week', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'AI Tutor access', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Unlimited mock tests', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPrice: 999,
    yearlyPrice: 7999,
    icon: Crown,
    color: 'text-primary-600 dark:text-primary-400',
    borderColor: 'border-primary-400 dark:border-primary-600',
    badge: 'Most Popular',
    features: [
      { text: '200 MCQs per day', included: true },
      { text: '50 AI tokens per day', included: true },
      { text: 'Unlimited mock tests', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'AI Tutor access', included: true },
      { text: 'Detailed subject breakdown', included: true },
      { text: 'Priority support', included: false },
      { text: 'Lifetime access', included: false },
    ],
  },
  {
    tier: 'lifetime',
    name: 'Lifetime',
    monthlyPrice: 4999,
    icon: InfinityIcon,
    color: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-400 dark:border-amber-600',
    badge: 'Best Value',
    features: [
      { text: 'Unlimited MCQs per day', included: true },
      { text: 'Unlimited AI tokens per day', included: true },
      { text: 'Unlimited mock tests', included: true },
      { text: 'Full analytics suite', included: true },
      { text: 'AI Tutor access', included: true },
      { text: 'Detailed subject breakdown', included: true },
      { text: 'Priority support', included: true },
      { text: 'One-time payment', included: true },
    ],
  },
];

const tokenPacks: TokenPack[] = [
  {
    id: 'pack-500',
    name: 'Starter Pack',
    tokens: 500,
    price: 299,
    currency: 'PKR',
  },
  {
    id: 'pack-2000',
    name: 'Power Pack',
    tokens: 2000,
    price: 899,
    currency: 'PKR',
    originalPrice: 1196,
    badge: 'Save 25%',
  },
  {
    id: 'pack-5000',
    name: 'Mega Pack',
    tokens: 5000,
    price: 1999,
    currency: 'PKR',
    originalPrice: 2990,
    badge: 'Save 33%',
  },
  {
    id: 'daily-pass',
    name: 'Unlimited Daily Pass',
    tokens: -1,
    price: 149,
    currency: 'PKR',
    badge: '1 Day',
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'jazzcash', type: 'jazzcash', name: 'JazzCash', icon: ' JazzCash' },
  { id: 'easypaisa', type: 'easypaisa', name: 'Easypaisa', icon: ' EP' },
  { id: 'card', type: 'card', name: 'Credit / Debit Card', icon: '' },
  { id: 'stripe', type: 'stripe', name: 'Stripe', icon: '' },
];

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{
    type: 'subscription' | 'token';
    tier?: SubscriptionTier;
    pack?: TokenPack;
  } | null>(null);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod['type']>('jazzcash');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  function handleSubscribe(tier: SubscriptionTier) {
    setModalContext({ type: 'subscription', tier });
    setModalOpen(true);
    setPaymentSuccess(false);
  }

  function handleBuyTokens(pack: TokenPack) {
    setModalContext({ type: 'token', pack });
    setModalOpen(true);
    setPaymentSuccess(false);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalContext(null);
    setPaymentSuccess(false);
    setTransactionId('');
  }

  function handlePayment() {
    setProcessing(true);
    setTimeout(() => {
      setTransactionId(`TXN-${Date.now().toString(36).toUpperCase()}`);
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  }

  const getPrice = (t: (typeof tiers)[number]) => {
    if (!t.monthlyPrice) return null;
    return billingCycle === 'yearly' && t.yearlyPrice
      ? t.yearlyPrice
      : t.monthlyPrice;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500">
          <Sparkles size={22} className="text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
          Upgrade Your Preparation
        </h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
          Unlock premium features to supercharge your CSS & competitive exam
          prep
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'rounded-md px-4 py-1.5 text-xs font-medium transition-colors',
              billingCycle === 'monthly'
                ? 'bg-primary-500 text-white'
                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'rounded-md px-4 py-1.5 text-xs font-medium transition-colors',
              billingCycle === 'yearly'
                ? 'bg-primary-500 text-white'
                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
            )}
          >
            Yearly
            <span className="ml-1 text-[10px] text-accent-500">Save 33%</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiers.map((t) => {
          const price = getPrice(t);
          const Icon = t.icon;
          return (
            <div
              key={t.tier}
              className={cn(
                'relative flex flex-col rounded-xl border-2 bg-[rgb(var(--color-surface))] p-5 transition-all hover:shadow-lg',
                t.borderColor,
                t.tier === 'pro' &&
                  'ring-2 ring-primary-400 dark:ring-primary-600'
              )}
            >
              {t.badge && (
                <div
                  className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold text-white',
                    t.tier === 'pro' ? 'bg-primary-500' : 'bg-amber-500'
                  )}
                >
                  {t.badge}
                </div>
              )}

              <div className={cn('flex items-center gap-2', t.color)}>
                <Icon size={20} />
                <h3 className="text-lg font-bold font-heading">{t.name}</h3>
              </div>

              <div className="mt-4">
                {price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                      Rs. {price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-text-muted))]">
                      /{billingCycle === 'yearly' ? 'year' : 'mo'}
                    </span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                    Free
                  </div>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2">
                    {f.included ? (
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0 text-accent-500"
                      />
                    ) : (
                      <X
                        size={14}
                        className="mt-0.5 shrink-0 text-[rgb(var(--color-text-muted))]"
                      />
                    )}
                    <span
                      className={cn(
                        'text-xs',
                        f.included
                          ? 'text-[rgb(var(--color-text-primary))]'
                          : 'text-[rgb(var(--color-text-muted))]'
                      )}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={t.tier === 'pro' ? 'primary' : 'outline'}
                fullWidth
                className="mt-5"
                disabled={t.tier === 'free'}
                onClick={() => t.tier !== 'free' && handleSubscribe(t.tier)}
                rightIcon={
                  t.tier !== 'free' ? <ArrowRight size={14} /> : undefined
                }
              >
                {t.tier === 'free' ? 'Current Plan' : 'Get Started'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          <h2 className="text-base font-bold font-heading text-[rgb(var(--color-text-primary))]">
            AI Token Packs
          </h2>
        </div>
        <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
          Need more AI tokens? Purchase additional packs for explanations, study
          plans, and tutor access.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tokenPacks.map((pack) => (
            <div
              key={pack.id}
              className={cn(
                'relative flex flex-col rounded-xl border bg-[rgb(var(--color-surface))] p-4 transition-all hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700',
                pack.badge === '1 Day'
                  ? 'border-amber-300 dark:border-amber-700'
                  : 'border-[rgb(var(--color-border))]'
              )}
            >
              {pack.badge && (
                <span
                  className={cn(
                    'absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold text-white',
                    pack.badge === '1 Day' ? 'bg-amber-500' : 'bg-accent-500'
                  )}
                >
                  {pack.badge}
                </span>
              )}

              <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                {pack.name}
              </h3>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
                  {pack.tokens === -1 ? '∞' : pack.tokens.toLocaleString()}
                </span>
                <span className="text-[10px] text-[rgb(var(--color-text-muted))]">
                  tokens
                </span>
              </div>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                  Rs. {pack.price.toLocaleString()}
                </span>
                {pack.originalPrice && (
                  <span className="text-[10px] text-[rgb(var(--color-text-muted))] line-through">
                    Rs. {pack.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-3"
                onClick={() => handleBuyTokens(pack)}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && modalContext && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-2xl">
            <button
              onClick={handleCloseModal}
              className="absolute right-3 top-3 rounded-lg p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
            >
              <XIcon size={16} />
            </button>

            {paymentSuccess ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900">
                  <Check
                    size={32}
                    className="text-accent-600 dark:text-accent-400"
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold font-heading text-[rgb(var(--color-text-primary))]">
                  Payment Successful!
                </h3>
                <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                  {modalContext.type === 'subscription'
                    ? `You are now on the ${modalContext.tier?.toUpperCase()} plan. Enjoy your premium features!`
                    : `${modalContext.pack?.tokens === -1 ? 'Unlimited' : modalContext.pack?.tokens.toLocaleString()} tokens have been added to your account.`}
                </p>
                <p className="mt-3 text-[10px] text-[rgb(var(--color-text-muted))]">
                  Transaction ID: {transactionId}
                </p>
                <Button className="mt-5" onClick={handleCloseModal}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                    <CreditCard
                      size={16}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <h3 className="text-base font-bold font-heading text-[rgb(var(--color-text-primary))]">
                    Complete Payment
                  </h3>
                </div>

                <div className="mt-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                      {modalContext.type === 'subscription'
                        ? `${modalContext.tier?.charAt(0).toUpperCase()}${modalContext.tier?.slice(1)} Plan (${billingCycle})`
                        : modalContext.pack?.name}
                    </span>
                    <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                      Rs.{' '}
                      {modalContext.type === 'subscription'
                        ? (billingCycle === 'yearly'
                            ? tiers.find((t) => t.tier === modalContext.tier)
                                ?.yearlyPrice
                            : tiers.find((t) => t.tier === modalContext.tier)
                                ?.monthlyPrice
                          )?.toLocaleString()
                        : modalContext.pack?.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-[rgb(var(--color-text-primary))]">
                  Select Payment Method
                </p>

                <div className="mt-2 space-y-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.type)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                        selectedPayment === pm.type
                          ? 'border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-950'
                          : 'border-[rgb(var(--color-border))] hover:border-primary-200 dark:hover:border-primary-800'
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgb(var(--color-surface-elevated))]">
                        {pm.type === 'jazzcash' || pm.type === 'easypaisa' ? (
                          <Smartphone size={16} className="text-primary-500" />
                        ) : (
                          <CreditCard size={16} className="text-primary-500" />
                        )}
                      </div>
                      <span className="flex-1 text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {pm.name}
                      </span>
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full border-2',
                          selectedPayment === pm.type
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-[rgb(var(--color-text-muted))]'
                        )}
                      >
                        {selectedPayment === pm.type && (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent-50 p-2.5 dark:bg-accent-950">
                  <Shield
                    size={14}
                    className="shrink-0 text-accent-600 dark:text-accent-400"
                  />
                  <p className="text-[10px] text-accent-700 dark:text-accent-300">
                    Your payment is secured with 256-bit SSL encryption. We
                    never store your card details.
                  </p>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-4"
                  isLoading={processing}
                  onClick={handlePayment}
                  leftIcon={!processing ? <Gift size={16} /> : undefined}
                >
                  {processing
                    ? 'Processing...'
                    : `Pay Rs. ${
                        modalContext.type === 'subscription'
                          ? (billingCycle === 'yearly'
                              ? tiers.find((t) => t.tier === modalContext.tier)
                                  ?.yearlyPrice
                              : tiers.find((t) => t.tier === modalContext.tier)
                                  ?.monthlyPrice
                            )?.toLocaleString()
                          : modalContext.pack?.price.toLocaleString()
                      }`}
                </Button>

                <p className="mt-3 text-center text-[10px] text-[rgb(var(--color-text-muted))]">
                  By completing this payment, you agree to our Terms of Service
                  and Refund Policy.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
